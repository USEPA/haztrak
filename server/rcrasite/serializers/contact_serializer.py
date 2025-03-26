"""Serializers for the Contact model."""

from rcrasite.models import Contact
from rest_framework import serializers

from .base_serializer import SitesBaseSerializer


class RcraPhoneSerializer(SitesBaseSerializer):
    """ManifestPhone model serializer for JSON marshalling/unmarshalling."""

    number = serializers.CharField()
    extension = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    class Meta:
        """Metaclass."""

        model = Contact
        fields = [
            "number",
            "extension",
        ]


class ContactSerializer(SitesBaseSerializer):
    """Contact model serializer for JSON marshalling/unmarshalling."""

    firstName = serializers.CharField(
        source="first_name",
        required=False,
    )
    middleInitial = serializers.CharField(
        source="middle_initial",
        required=False,
    )
    lastName = serializers.CharField(
        source="last_name",
        required=False,
    )
    phone = RcraPhoneSerializer(
        required=False,
    )
    email = serializers.CharField(
        required=False,
    )
    companyName = serializers.CharField(
        source="company_name",
        required=False,
    )

    class Meta:
        """Metaclass."""

        model = Contact
        fields = [
            "firstName",
            "middleInitial",
            "lastName",
            "phone",
            "email",
            "companyName",
        ]
