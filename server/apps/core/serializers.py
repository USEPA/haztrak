from collections import OrderedDict

from django_celery_results.models import TaskResult
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from apps.core.models import (
    HaztrakOrg,
    HaztrakProfile,
    HaztrakSite,
    HaztrakUser,
    RcrainfoProfile,
    SitePermissions,
)
from apps.rcrasite.serializers import RcraSitePermissionSerializer, RcraSiteSerializer
from apps.rcrasite.serializers.base_serializer import SitesBaseSerializer


class HaztrakUserSerializer(ModelSerializer):
    """
    Model serializer for marshalling/unmarshalling a user's HaztrakUser
    """

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
        model = HaztrakUser
        fields = [
            "id",
            "username",
            "firstName",
            "lastName",
            "email",
        ]


class RcrainfoProfileSerializer(ModelSerializer):
    """Model serializer for marshalling/unmarshalling a user's RcrainfoProfile"""

    user = serializers.StringRelatedField(
        source="haztrak_profile",
    )
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
        allow_null=True,
        allow_blank=True,
    )
    rcraAPIKey = serializers.CharField(
        source="rcra_api_key",
        required=False,
        write_only=True,
        allow_blank=True,
        allow_null=True,
    )
    rcraUsername = serializers.CharField(
        source="rcra_username",
        required=False,
    )
    apiUser = serializers.BooleanField(
        source="has_rcrainfo_api_id_key",
        required=False,
        allow_null=False,
    )

    class Meta:
        model = RcrainfoProfile
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


class HaztrakSiteSerializer(ModelSerializer):
    """
    HaztrakSite model serializer for JSON marshalling/unmarshalling
    """

    name = serializers.CharField(
        required=False,
    )
    handler = RcraSiteSerializer(
        source="rcra_site",
    )

    class Meta:
        model = HaztrakSite
        fields = ["name", "handler"]


class HaztrakOrgSerializer(ModelSerializer):
    """Haztrak Organization Model Serializer"""

    id = serializers.CharField(
        required=False,
    )
    name = serializers.CharField(
        required=False,
    )
    rcrainfoIntegrated = serializers.BooleanField(
        source="is_rcrainfo_integrated",
        required=False,
    )

    class Meta:
        model = HaztrakOrg
        fields = [
            "name",
            "id",
            "rcrainfoIntegrated",
        ]


class SitePermissionSerializer(SitesBaseSerializer):
    class Meta:
        model = SitePermissions
        fields = [
            "site",
            "eManifest",
        ]

    site = HaztrakSiteSerializer()
    eManifest = serializers.CharField(
        source="emanifest",
    )


class HaztrakProfileSerializer(ModelSerializer):
    """Serializer for a user's profile"""

    user = serializers.StringRelatedField(
        required=False,
    )
    sites = SitePermissionSerializer(
        source="site_permissions",
        many=True,
    )
    org = HaztrakOrgSerializer()

    class Meta:
        model = HaztrakProfile
        fields = [
            "user",
            "sites",
            "org",
        ]
