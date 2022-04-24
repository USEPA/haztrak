FROM python:3.8-slim
LABEL maintainer="dpgraham4401@gmail.com"

# Create project directory (workdir)
ENV PROJECT_ROOT /app
WORKDIR $PROJECT_ROOT
# Add requirements.txt to WORKDIR and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Add source code files to WORKDIR
COPY . .
CMD python manage.py runserver 0.0.0.0:80