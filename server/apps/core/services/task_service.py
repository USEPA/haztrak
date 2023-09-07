from django_celery_results.models import TaskResult

from apps.core.tasks import example_task


class TaskService:
    """
    Service class for interacting with the Task model layer and celery tasks.
    """

    def __init__(self):
        pass

    @staticmethod
    def get_task_status(task_id):
        """
        Gets the status of a long-running celery task
        """
        try:
            task = TaskResult.objects.get(task_id=task_id)
            print(task.id)
            return task.id
        except TaskResult.DoesNotExist:
            return "NOT FOUND"

    @staticmethod
    def launch_example_task():
        """
        Launches an example long-running celery task
        """
        try:
            task = example_task.delay()
            return task.id
        except KeyError:
            return None
