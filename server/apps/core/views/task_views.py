from celery.result import AsyncResult
from django_celery_results.models import TaskResult
from rest_framework import serializers, status
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from apps.core.tasks import example_task


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


class ExampleTaskView(RetrieveAPIView):
    """
    Launches an example long-running background task
    """

    def retrieve(self, request, *args, **kwargs):
        try:
            task = example_task.delay()
            return Response(data={"task": task.id}, status=status.HTTP_200_OK)
        except KeyError:
            return Response(
                data={"error": "malformed payload"}, status=status.HTTP_400_BAD_REQUEST
            )


class TaskStatusView(GenericAPIView):
    """
    Endpoint for retrieving the status of long-running celery tasks
    Uses django-celery-results pacakge which stores the task results in our DB
    """

    serializer_class = CeleryTaskResultSerializer
    queryset = None

    def get(self, request: Request, task_id):
        task_result = AsyncResult(task_id)
        print(task_result)
        return Response(
            {
                "taskId": task_result.task_id,
                "taskStatus": task_result.status,
                "taskResult": task_result.result,
            }
        )
