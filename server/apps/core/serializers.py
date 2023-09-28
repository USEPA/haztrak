from collections import OrderedDict

from django_celery_results.models import TaskResult
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from apps.core.models import HaztrakUser, RcraProfile
from apps.sites.serializers import RcraSitePermissionSerializer


class HaztrakUserSerializer(ModelSerializer):
    """
    Model serializer for marshalling/unmarshalling a user's HaztrakUser
    """

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
        model = HaztrakUser
        fields = [
            "username",
            "firstName",
            "lastName",
            "email",
        ]


class RcraProfileSerializer(ModelSerializer):
    """
    Model serializer for marshalling/unmarshalling a user's RcraProfile
    """

    user = serializers.StringRelatedField()
    rcraSites = RcraSitePermissionSerializer(
        source="permissions",
        required=False,
        many=True,
    )
    phoneNumber = serializers.CharField(
        source="phone_number",
        required=False,
    )
    rcraAPIID = serializers.CharField(
        source="rcra_api_id",
        required=False,
    )
    rcraAPIKey = serializers.CharField(
        source="rcra_api_key",
        required=False,
        write_only=True,
    )
    rcraUsername = serializers.CharField(
        source="rcra_username",
        required=False,
    )
    apiUser = serializers.BooleanField(
        source="is_api_user",
        required=False,
        allow_null=False,
    )

    class Meta:
        model = RcraProfile
        fields = [
            "user",
            "rcraAPIID",
            "rcraAPIKey",
            "rcraUsername",
            "rcraSites",
            "phoneNumber",
            "apiUser",
        ]


class TaskResultSerializer(serializers.ModelSerializer):
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
        model = TaskResult
        fields = [
            "taskId",
            "taskName",
            "status",
            "createdDate",
            "doneDate",
        ]


class TaskStatusSerializer(serializers.Serializer):
    """
    Serializer for status or results of long-running celery tasks
    """

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
        result = super().to_representation(instance)
        return OrderedDict([(key, result[key]) for key in result if result[key] is not None])
