FROM python:3.12.2-bookworm
LABEL maintainer="graham.david@epa.gov"
ENV APP_DIRECTORY=/app/server
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
RUN apt install libffi-dev gcc libc-dev
WORKDIR $APP_DIRECTORY
COPY ./server $APP_DIRECTORY
RUN python -m pip install --no-cache-dir --quiet -r requirements.txt
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
