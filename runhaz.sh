#!/bin/bash

BASE_DIR=$(dirname "$0")
DJANGO_APPS=(api trak accounts home)

# check python is installed
if command -v python3 > /dev/null 2>&1; then
    PYTHON=$(command -v python3)
    BASE_CMD="$PYTHON $BASE_DIR/manage.py "
else
  echo python3 not found
fi

# check python version is at least 3.8
ver=$($PYTHON -V 2>&1 | sed 's/.* \([0-9]\).\([0-9]\).*/\1\2/')
if [ "$ver" -lt "38" ]; then
    echo "runhaz, and django 4.0, required python version 3.8 or greater"
    exit 1
fi

print_usage() {
   # Display Help
   echo "Command line utility to run and test Haztrak"
   echo
   echo "Syntax: $(basename "$0") [-t|r|h|m]"
   echo "options:"
   echo "h     Print this help message"
   echo "r     Run using Django's built in runserver command"
   echo "t     Test by app name(s), defaults to all"
   echo "m     Makemigrations, migrate and dump fixture data for unittests"
   echo
}

test_django(){
    # Test all or certain django apps
    CMD="$BASE_CMD test"
	if [ "$#" -eq 0 ]; then
	  eval "$CMD"
	  exit 0
	fi
	for i in "$@"
	do
	  if [[ "${DJANGO_APPS[*]}" =~ ${i} ]]
	  then
		CMD="$BASE_CMD apps.$i"
	  fi
	done
	echo "Running tests --> $CMD"
	eval "$CMD"
}

django_migrate(){
    # makemigrations and migrate if necessary
    if eval "$BASE_CMD makemigrations"
    then
        eval "$BASE_CMD migrate"
    fi
}

django_dump(){
    # dump the database into a fixture file, migrations should be applied before
    # defaults to stdout
    CMD="$BASE_CMD dumpdata"
	if [ "$#" -eq 0 ]; then
	  eval "$CMD"
	  exit 0
	fi
	for i in "$@"
	do
	  if [[ $i -ne 0 ]]
	  then
		CMD="$CMD $i"
	  fi
	done
	echo "Running --> $CMD"
	eval "$CMD"
}

# Parse CLI argument
while getopts 'trmhd' opt; do
  case "$opt" in
    t)
		test_django "$@"
		;;
    m)
        django_migrate
        ;;
    d)
        django_dump "$@"
        ;;
    r)
        eval "$CMD runserver"
		;;
    \?|h)
	  print_usage
      exit 1
      ;;
  esac
done
shift $((OPTIND-1))
