from django.core.cache import CacheKeyWarning, cache
from rest_framework.exceptions import ValidationError

from apps.core.serializers import TaskStatusSerializer
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
        Retrieves the task status from the cache (the default cache configured in django settings)
        """
        try:
            cache_data = cache.get(task_id)
            if cache_data is not None:
                task_serializer = TaskStatusSerializer(data=cache_data)
                if task_serializer.is_valid():
                    return task_serializer.data
                if task_serializer.errors:
                    raise ValidationError(f"error retrieving task ID: {task_id}")
            else:
                raise KeyError(f"error retrieving task ID: {task_id}")
        except CacheKeyWarning:
            return KeyError(f"error retrieving task ID: {task_id}")

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
