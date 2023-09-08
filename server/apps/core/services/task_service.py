from django.core.cache import CacheKeyWarning, cache
from django_celery_results.models import TaskResult
from rest_framework.exceptions import ValidationError

from apps.core.serializers import TaskStatusSerializer
from apps.core.tasks import example_task


class TaskService:
    """
    Service class for interacting with the Task model layer and celery tasks.
    """

    def __init__(self):
        pass

    @classmethod
    def get_task_status(cls, task_id):
        """
        Gets the status of a long-running celery task
        Retrieves the task status from the cache (the default cache configured in django settings)
        """
        try:
            cache_data = cache.get(task_id)
            if cache_data is not None:
                task_serializer = TaskStatusSerializer(data=cache_data)
                if task_serializer.is_valid():
                    if (
                        task_serializer.data["status"] == "SUCCESS"
                        or task_serializer.data["status"] == "FAILURE"
                    ):
                        return cls.get_task_results(task_id)
                    return task_serializer.data
                if task_serializer.errors:
                    raise ValidationError(f"error retrieving task ID: {task_id}")
            else:
                # If the task is not in the cache, check the database
                return cls.get_task_results(task_id)
        except CacheKeyWarning:
            # Cache keys have a max length, raise a predictable error if the key is too long
            return KeyError(f"error retrieving task ID: {task_id}")

    @staticmethod
    def get_task_results(task_id):
        """
        Gets the results of a long-running celery task stored in the database
        """
        try:
            task_results = TaskResult.objects.get(task_id=task_id)
            task_serializer = TaskStatusSerializer(task_results)
            return task_serializer.data
        except TaskResult.DoesNotExist:
            raise KeyError(f"error retrieving task ID: {task_id}")

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
