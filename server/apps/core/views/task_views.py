from django_celery_results.models import TaskResult
from rest_framework import permissions, serializers, status
from rest_framework.exceptions import ValidationError
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


class LaunchExampleTaskView(APIView):
    """
    Launches an example long-running background task
    """

    response = Response
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            task_id = TaskService.launch_example_task()
            return self.response(data={"task": task_id}, status=status.HTTP_200_OK)
        except KeyError:
            return self.response(
                data={"error": "malformed payload"}, status=status.HTTP_400_BAD_REQUEST
            )


class TaskStatusView(APIView):
    """
    Endpoint for retrieving the status of long-running celery tasks
    Uses django-celery-results pacakge which stores the task results in our DB
    """

    queryset = TaskResult.objects.all()
    response = Response

    def get(self, request: Request, task_id):
        try:
            data = TaskService.get_task_status(task_id)
            return self.response(data=data, status=status.HTTP_200_OK)
        except KeyError as exc:
            return self.response(data={"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as exc:
            return self.response(
                data={"error": exc.detail}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except TaskResult.DoesNotExist as exc:
            return self.response(data={"error": str(exc)}, status=status.HTTP_404_NOT_FOUND)
