import logging

from django.core.cache import CacheKeyWarning, cache
from django_celery_results.models import TaskResult
from rest_framework.exceptions import ValidationError
from rest_framework.utils.serializer_helpers import ReturnDict

from apps.core.serializers import TaskStatusSerializer
from apps.core.tasks import example_task

logger = logging.getLogger(__name__)


class TaskService:
    """
    Service class for interacting with the Task model layer and celery tasks.
    """

    def __init__(self):
        pass

    @classmethod
    def get_task_status(cls, task_id) -> ReturnDict:
        """
        Gets the status of a long-running celery task from the cache (if present) or the database
        """
        cache_data = cls._get_cached_status(task_id)
        if cache_data is not None:
            return cls._parse_status(cache_data)
        else:
            return cls.get_task_results(task_id)

    @staticmethod
    def get_task_results(task_id):
        """
        Gets the results of a long-running celery task stored in the database
        """
        task_results = TaskResult.objects.get(task_id=task_id)
        task_serializer = TaskStatusSerializer(task_results)
        return task_serializer.data

    @staticmethod
    def _parse_status(task_status: dict) -> ReturnDict:
        task_serializer = TaskStatusSerializer(data=task_status)
        if task_serializer.is_valid():
            return task_serializer.data
        raise ValidationError(task_serializer.errors)

    @staticmethod
    def _get_cached_status(task_id) -> dict | None:
        """
        Gets the status of a long-running celery task from our key-value store
        if not found or error, returns None
        :param task_id:
        :return dict None:
        """
        try:
            cache_data = cache.get(task_id)
            if cache_data is not None:
                return cache_data
            return None
        except CacheKeyWarning:
            return None

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
