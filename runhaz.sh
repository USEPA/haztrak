#!/bin/bash

base_dir=$(dirname "$0")

# check python is installed
if command -v python3 > /dev/null 2>&1; then
    python_cmd=$(command -v python3)
    base_cmd="$python_cmd $base_dir/manage.py "
elif command -v python > /dev/null 2>&1; then
    python_cmd=$(command -v python)
    base_cmd="$python_cmd $base_dir/manage.py "
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

print_usage() {
   # Display Help
   echo "Command line utility to help develop Haztrak"
   echo
   echo "Syntax: $(basename "$0") [-m|d|l|t|p|r|h]"
   echo "options:"
   echo "m     Makemigrations and migrate"
   echo "d     Dump data into fixtures files tests (if needed, migrate first)"
   echo "l     load fixture data from test/fixtures/test_data.json"
   echo "t     Run all unittests"
   echo "p     installs hooks, if necessary, and runs pre-commit run --all-files"
   echo "r     Run haztrak locally"
   echo "h     Print this help message"
   echo
}

migrate_changes(){
    # Use Django's 'makemigrations' and 'migrate' to propagate model changes
    # since their typically executed together, this is just more convenient
    echo "$base_cmd"
    if eval "$base_cmd makemigrations"
    then
        eval "$base_cmd migrate"
    fi
}

dump_fixtures(){
    # hardcoded (data)dumps (hehe) for fixture files used for unittests
    # if more fixtures files are added, they will need to be added here
    exec_cmd="$base_cmd dumpdata"
    fixture_dir="$base_dir/tests/fixtures"
    fixture_cmd=(
    "-e contenttypes -e auth.permission -e admin.logentry -e sessions.session > $fixture_dir/test_data.json"
    "trak.WasteLine --pks=1 > $fixture_dir/test_waste_line.json"
    )
    for i in "${fixture_cmd[@]}"
    do
        eval "$exec_cmd $i"
    done
    echo "Data dumped"
}

load_fixtures() {
    # load initial data, good if you need to wipe the dev database
    # creates users 'admin', 'testuser1', both with 'password1'
    exec_cmd="$base_cmd loaddata tests/fixtures/test_data.json"
    eval "$exec_cmd"
}

test_django(){
    # Since I moved all tests to the 'tests' directory, you can just run all tests
    # sorry
    eval "$base_cmd test"
}

run_pre_commit() {
    # This will install the pre-commit script, and run whatever pre-commit
    # hooks we have configured. Great to run before committing as a pre-commit hook
    # failure will abort the commit
    if command -V pre-commit > /dev/null 2>&1 ; then
        eval "pre-commit install"
        eval "pre-commit run --all-files"
    else
        echo "pre-commit not found, did you forget to activate your virtualenv?"
        exit 1
    fi
}

# Parse CLI argument
while getopts 'mdltprh' opt; do
  case "$opt" in
    m)
        migrate_changes
        ;;
    d)
        dump_fixtures "$@"
        ;;
    l)
        load_fixtures
        ;;
    t)
		test_django "$@"
		;;
    p)
        run_pre_commit
        ;;
    r)
        eval "$base_cmd runserver"
		;;
    \?|h)
	  print_usage
      exit 1
      ;;
  esac
done
shift $((OPTIND-1))
