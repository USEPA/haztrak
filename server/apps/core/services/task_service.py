from django.core.cache import cache

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
        """
        cache_data = cache.get(task_id)
        print("cache_data", cache_data)
        if cache_data is not None:
            print("cache_data is not None")
            task_serializer = TaskStatusSerializer(data=cache_data)
            if task_serializer.is_valid():
                return task_serializer.data
            else:
                print(task_serializer.errors)
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
