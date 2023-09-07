from django.core.cache import cache
from django_celery_results.models import TaskResult
from rest_framework import permissions, serializers, status
from rest_framework.generics import RetrieveAPIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.services.task_service import TaskService


class CeleryTaskResultSerializer(serializers.ModelSerializer):
    """
    Serializer for results of long-running celery tasks
    from django-celery-results
    """

    taskId = serializers.CharField(source="task_id", read_only=True)
    taskName = serializers.CharField(source="task_name", read_only=True)
    createdDate = serializers.DateTimeField(source="date_created", read_only=True)
    doneDate = serializers.DateTimeField(source="date_done", read_only=True)

    class Meta:
        model = TaskResult
        fields = ["taskId", "taskName", "status", "createdDate", "doneDate"]


class LaunchExampleTaskView(RetrieveAPIView):
    """
    Launches an example long-running background task
    """

    permission_classes = [permissions.AllowAny]

    def retrieve(self, request, *args, **kwargs):
        try:
            task_id = TaskService.launch_example_task()
            return Response(data={"task": task_id}, status=status.HTTP_200_OK)
        except KeyError:
            return Response(
                data={"error": "malformed payload"}, status=status.HTTP_400_BAD_REQUEST
            )


class TaskStatusView(APIView):
    """
    Endpoint for retrieving the status of long-running celery tasks
    Uses django-celery-results pacakge which stores the task results in our DB
    """

    queryset = None
    response = Response
    permission_classes = [permissions.AllowAny]

    def get(self, request: Request, task_id):
        cache_status = cache.get(task_id)
        if cache_status is not None:
            return self.response({f"{task_id}": cache_status})
        else:
            return self.response({f"{task_id}": "NOT FOUND"})
