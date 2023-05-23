#!/bin/bash

base_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
server_dir="$base_dir/server"
client_dir="$base_dir/client"

# check python is installed
if command -v python3 > /dev/null 2>&1; then
    python_cmd=$(command -v python3)
    base_py_cmd="$python_cmd $server_dir/manage.py "
elif command -v python > /dev/null 2>&1; then
    python_cmd=$(command -v python)
    base_py_cmd="$python_cmd $server_dir/manage.py "
else
  echo "Python3 not found"
  exit 1
fi

# check python version is at least 3.8
ver=$($python_cmd -V 2>&1 | sed 's/.* \([0-9]\).\([0-9]\).*/\1\2/')
if [ "$ver" -eq "31" ]; then
    :
elif [ "$ver" -lt "38" ]; then
    echo "Python version 3.8 or greater is expected, received $ver"
    exit 1
fi

# prints colored text
print_style() {

    if [ "$2" == "info" ] ; then
        COLOR="96m";
    elif [ "$2" == "success" ] ; then
        COLOR="92m";
    elif [ "$2" == "warning" ] ; then
        COLOR="93m";
    elif [ "$2" == "danger" ] ; then
        COLOR="91m";
    else #default color
        COLOR="0m";
    fi

    START_COLOR="\e[$COLOR";
    END_COLOR="\e[0m";

    printf "$START_COLOR%b$END_COLOR" "$1";
}

print_usage() {
   # Display help
   echo "Command line utility to help develop Haztrak"
   echo
   echo "Syntax: $(basename "$0") <option>"
   echo "options:"
   echo "-m, --migrate       Make django migrations and apply (makemigrations and migrate)"
   echo "-d, --db            Bring up the local development database and expose it on port 5432"
   echo "-l, --load          load initial database data from fixture files"
   echo "-t, --test          Run all tests, show output if exit status is not 0"
   echo "-p, --pre-commit    installs hooks, if necessary, and runs pre-commit run --all-files"
   echo "-o, --openapi		   Generate the Open API Schema to /docs/API/"
   echo "-e, --erd           Graph the django models to an entity relationship diagram (ERD), requires graphviz"
   echo "-h, --help          Print this help message"
   echo
}

migrate_changes(){
    # Use Django's 'makemigrations' and 'migrate' to propagate model changes
    # since their typically executed together, this is just more convenient
    echo "$base_py_cmd"
    if eval "$base_py_cmd makemigrations"
    then
        eval "$base_py_cmd migrate"
    fi
    exit
}

start_db(){
    if command -v docker> /dev/null 2>&1; then
        docker_exec=$(command -v docker)
    else
      print_style "Docker not found" "danger"
      exit 1
    fi
    eval "$docker_exec compose --env-file $base_dir/configs/.env.dev up -d postgres"
    exit
}

load_django_fixtures() {
    # load initial data, good if you need to drop the dev database
    fixtures_dir="$server_dir/fixtures"
    exec_cmd="$base_py_cmd loaddata $fixtures_dir/dev_data.yaml"
    eval "$exec_cmd"
    exit
}

generate_api_schema() {
    print_style "Generating Open API schema...\n" "success";
    exec_cmd="$base_py_cmd spectacular --settings haztrak.settings --file $base_dir/docs/api/postman/schemas/openapi-schema.yaml"
    eval "$exec_cmd"
    exit
}


graph_models() {
    print_style "Generating Entity Relationship Diagram...\n" "success";
    exec_cmd="$base_py_cmd graph_models sites trak \
    -g \
    --settings haztrak.settings \
    --rankdir=RL \
    --arrow-shape=normal \
    --exclude-models=*BaseModel \
    --disable-abstract-fields \
    -o $base_dir/docs/haztrak_book/src/assets/erd.png"
    eval "$exec_cmd"
    exit
}

print_test_status(){
        if [ "$1" -eq 0 ];
    then
        print_style "Passed!\n" "success";
    else
        print_style "Failed\n" "danger";
    fi

}

test_django(){
    # run all django's/server tests
    printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' =
    echo "Running Haztrak test..."
    printf "Testing Server: "
    cd "$server_dir" || exit
    django_output="$(eval "pytest 2>&1")"
    django_exit_code=$?
    print_test_status $django_exit_code
    cd "$base_dir" || exit
    cd "$client_dir" || exit
    printf "Testing Client: "
    npm_output="$(eval "npm test 2>&1")"
    npm_exit_code=$?
    print_test_status $npm_exit_code
    printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' =
    sleep 2
    if [ $django_exit_code -ne 0 ];
    then
        echo "DJANGO TEST OUTPUT..."
        printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' =
        echo "${django_output}"
    fi
    if [ $npm_exit_code -ne 0 ];
    then
        echo "NPM TEST OUTPUT..."
        printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' =
        echo "${npm_output}"
    fi
}

run_pre_commit() {
    # This will install the pre-commit script, and run whatever pre-commit
    # hooks we have configured. Great to run before committing as a pre-commit hook
    # failure will abort the commit
    if command -V pre-commit > /dev/null 2>&1 ; then
        eval "pre-commit install"
        eval "pre-commit run --all-files"
        exit
    else
        echo "pre-commit not found, did you forget to activate your virtualenv?"
        exit 1
    fi
}

cleanup() {
	echo
	print_style "Haztrak shutting down...\n" "success";
	kill -- -0
	exit
}

# Parse CLI argument
while [[ $# -gt 0 ]]; do
  case $1 in
    -m|--migrate)
        migrate_changes
        ;;
    -d|--db)
        start_db "$@"
#		shift # past argument
#		shift # past value
        ;;
    -l|--load)
        load_django_fixtures
        ;;
    -t|--test)
		test_django "$@"
		shift # past argument
		shift # past value
		exit 0
		;;
    -p|--pre-commit)
        run_pre_commit
        ;;
    -o|--openapi)
		generate_api_schema
		;;
    -e|--erd)
	  graph_models
		;;
    *)
      echo "Unknown option $1"
	  print_usage
      exit 1
      ;;
  esac
done
