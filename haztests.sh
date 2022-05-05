DJANGO_APPS=(api trak accounts home)
TEST_CMD="python manage.py test"

if [ "$#" -eq 0 ]; then
  eval "$TEST_CMD"
fi

for i in "$@"
do
  if [[ "${DJANGO_APPS[*]}" =~ ${i} ]]
  then
    TEST_CMD="$TEST_CMD apps.$i"
  fi
done
echo "Running --> $TEST_CMD"
eval "$TEST_CMD"
