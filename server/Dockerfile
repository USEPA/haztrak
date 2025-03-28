# Builder
FROM python:3.12.9-alpine3.21 AS builder
LABEL maintainer="graham.david@epa.gov"
ENV APP_DIRECTORY=/app/
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
RUN apk add libffi-dev gcc libc-dev curl
WORKDIR $APP_DIRECTORY
#
ADD https://astral.sh/uv/install.sh /uv-installer.sh
RUN sh /uv-installer.sh && rm /uv-installer.sh
ENV PATH="/root/.local/bin/:$PATH"

RUN mkdir $APP_DIRECTORY/static
RUN mkdir $APP_DIRECTORY/media
COPY . .

RUN uv venv
RUN uv sync --frozen
ENV VIRTUAL_ENV="/app/.venv"
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# local
#FROM builder AS dev
ENV VIRTUAL_ENV="/app/.venv"
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
RUN source $VIRTUAL_ENV/bin/activate
EXPOSE 8000
RUN python manage.py makemigrations && \
    python manage.py migrate && \
    python manage.py collectstatic --noinput && \
    python manage.py loaddata core_dev.yaml rcrasite_dev.yaml org_dev.yaml profile_dev.yaml
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# Production
#FROM builder AS production
#EXPOSE 8000
#CMD  ./run.sh
