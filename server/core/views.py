"""Views for the core app."""

from core.serializers import TrakUserSerializer
from core.services.task_service import get_task_status, launch_example_task
from django_celery_results.models import TaskResult
from rest_framework import permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import RetrieveAPIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView


class LaunchExampleTaskView(APIView):
    """Launches an example long-running background task."""

    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        """Launch an example task."""
        try:
            task_id = launch_example_task()
            return Response(data={"taskId": task_id}, status=status.HTTP_200_OK)
        except KeyError:
            return Response(
                data={"error": "malformed payload"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class TaskStatusView(APIView):
    """retrieve the status of long-running tasks."""

    queryset = TaskResult.objects.all()

    def get(self, request: Request, task_id):
        """Retrieve the status of a task."""
        try:
            data = get_task_status(task_id)
            return Response(data=data, status=status.HTTP_200_OK)
        except KeyError:
            return Response(
                data={"error": "malformed request"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except ValidationError:
            return Response(
                data={"error": "problem validating request"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except TaskResult.DoesNotExist:
            return Response(data={"taskId": "unknown"}, status=status.HTTP_200_OK)


class GetCurrentTrakUserView(RetrieveAPIView):
    """Get the current user."""

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TrakUserSerializer

    def get_object(self):
        """Get the current user."""
        return self.request.user
