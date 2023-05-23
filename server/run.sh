#!/bin/sh
# Used to start the Production Django server
python manage.py migrate --noinput
gunicorn --bind 0.0.0.0:8000 --workers 3 haztrak.wsgi:application
