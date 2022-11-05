FROM python:3.10.8-alpine3.16

# Starting environment varibles
ENV APP_DIRECTORY=/app/
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR $APP_DIRECTORY

COPY requirements.txt ./

# Setup virtual environment and install dependencies
RUN python -m venv /opt/venv \
    && /opt/venv/bin/pip install --upgrade pip \
    && /opt/venv/bin/pip install --no-cache-dir --quiet -r requirements.txt

# Copy app into image working directory
COPY . .

ENV VIRTUAL_ENV="/opt/venv"
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

EXPOSE 8000

CMD  ["gunicorn", "--bind", ":8000", "--workers", "3", "haztrak.wsgi:application"]
