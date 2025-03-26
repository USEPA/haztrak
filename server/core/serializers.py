"""Serializers for marshalling/unmarshalling data."""

from collections import OrderedDict

from core.models import (
    TrakUser,
)
from django_celery_results.models import TaskResult
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer


class TrakUserSerializer(ModelSerializer):
    """Model serializer for marshalling/unmarshalling a user's HaztrakUser."""

    id = serializers.CharField(source="pk")
    username = serializers.CharField(
        required=False,
    )
    firstName = serializers.CharField(
        source="first_name",
        required=False,
    )
    lastName = serializers.CharField(
        source="last_name",
        required=False,
    )

    class Meta:
        """Metaclass."""

        model = TrakUser
        fields = [
            "id",
            "username",
            "firstName",
            "lastName",
            "email",
        ]


class TaskResultSerializer(serializers.ModelSerializer):
    """Serializer for status or results of long-running celery tasks."""

    taskId = serializers.CharField(
        source="task_id",
        required=True,
    )
    taskName = serializers.CharField(
        source="task_name",
        required=True,
    )
    status = serializers.ChoiceField(
        required=True,
        choices=["PENDING", "STARTED", "SUCCESS", "FAILURE", "NOT FOUND"],
    )
    createdDate = serializers.DateTimeField(
        source="date_created",
        required=False,
    )
    doneDate = serializers.DateTimeField(
        source="date_done",
        required=False,
    )
    result = serializers.JSONField(
        required=True,
    )

    class Meta:
        """Metaclass."""

        model = TaskResult
        fields = [
            "taskId",
            "taskName",
            "status",
            "createdDate",
            "doneDate",
        ]


class TaskStatusSerializer(serializers.Serializer):
    """Serializer for status or results of long-running celery tasks."""

    taskId = serializers.CharField(
        source="task_id",
        required=True,
    )
    taskName = serializers.CharField(
        source="task_name",
        required=True,
    )
    status = serializers.ChoiceField(
        required=True,
        choices=["PENDING", "STARTED", "SUCCESS", "FAILURE", "NOT FOUND"],
    )
    createdDate = serializers.DateTimeField(
        source="date_created",
        required=False,
    )
    doneDate = serializers.DateTimeField(
        source="date_done",
        required=False,
    )
    result = serializers.JSONField(
        required=False,
        allow_null=True,
    )

    def to_representation(self, instance):
        """Convert model instance to JSON."""
        result = super().to_representation(instance)
        return OrderedDict([(key, result[key]) for key in result if result[key] is not None])
