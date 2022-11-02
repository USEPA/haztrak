from celery import shared_task


@shared_task
def hello():
    print("Hello from shared task")
