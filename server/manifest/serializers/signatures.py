"""Serializers for manifest signatures."""

import datetime

from manifest.models import ESignature, PaperSignature, QuickerSign, Signer
from manifest.serializers.mixins import RemoveEmptyFieldsMixin
from rcrasite.serializers import RcraPhoneSerializer
from rest_framework import serializers


class QuickerSignSerializer(serializers.Serializer):
    """Serializer for EPA Quicker Sign objects."""

    manifestTrackingNumbers = serializers.ListField(
        source="mtn",
        child=serializers.CharField(),
    )
    printedSignatureName = serializers.CharField(
        source="printed_name",
    )
    printedSignatureDate = serializers.DateTimeField(
        source="printed_date",
        required=False,
        default_timezone=datetime.UTC,
        format=None,
        default=datetime.datetime.now(datetime.UTC),
    )
    siteType = serializers.CharField(
        source="site_type",
    )
    siteId = serializers.CharField(
        source="site_id",
    )
    transporterOrder = serializers.IntegerField(
        source="transporter_order",
        required=False,
    )

    def to_internal_value(self, data: dict):
        """Convert dictionary to QuickerSign object."""
        return super().to_internal_value(data)

    def to_representation(self, instance: dict | QuickerSign):
        """Convert QuickerSign object to a dictionary."""
        data = super().to_representation(instance)
        if isinstance(instance, dict):
            data["printedSignatureDate"] = instance["printed_date"].isoformat(
                timespec="milliseconds",
            )
        elif isinstance(instance, QuickerSign):
            data["printedSignatureDate"] = instance.printed_date.isoformat(timespec="milliseconds")
        else:
            data["printedSignatureDate"] = datetime.datetime.now(datetime.UTC).isoformat(
                timespec="milliseconds",
            )
        return data

    def update(self, instance, validated_data):
        """Update a QuickerSign object."""
        return self.Meta.model(**validated_data)

    def create(self, validated_data):
        """Create a new QuickerSign object."""
        return self.Meta.model(**validated_data)

    class Meta:
        """Metaclass."""

        model = QuickerSign
        fields = [
            "manifestTrackingNumbers",
            "printedSignatureName",
            "printedSignatureDate",
            "siteType",
            "siteId",
            "transporterOrder",
        ]


class SignerSerializer(RemoveEmptyFieldsMixin, serializers.ModelSerializer):
    """Serializer for EPA Signer Object."""

    userId = serializers.CharField(
        source="rcra_user_id",
        required=False,
    )
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
    contactType = serializers.CharField(
        source="get_contact_type_display",
        required=False,
    )
    signerRole = serializers.CharField(
        source="get_signer_role_display",
        required=False,
    )

    class Meta:
        """Metaclass."""

        model = Signer
        fields = [
            "userId",
            "firstName",
            "middleInitial",
            "lastName",
            "phone",
            "email",
            "contactType",
            "companyName",
            "signerRole",
        ]


class ESignatureSerializer(RemoveEmptyFieldsMixin, serializers.ModelSerializer):
    """Serializer for Electronic Signature on manifest."""

    signer = SignerSerializer(
        required=False,
    )
    order = serializers.IntegerField(
        required=False,
    )
    signatureDate = serializers.DateTimeField(
        source="sign_date",
        required=False,
    )
    cromerrActivityId = serializers.CharField(
        source="cromerr_activity_id",
        required=False,
    )
    cromerrDocumentId = serializers.CharField(
        source="cromerr_document_id",
        required=False,
    )
    onBehalf = serializers.BooleanField(
        source="on_behalf",
        default=False,
        required=False,
    )

    def update(self, instance, validated_data):
        """Update an ESignature object."""
        return super().update(instance, validated_data)

    def create(self, validated_data: dict):
        """Create a new ESignature object."""
        return self.Meta.model.objects.save(**validated_data)

    class Meta:
        """Metaclass."""

        model = ESignature
        fields = [
            "signer",
            "cromerrActivityId",
            "cromerrDocumentId",
            "signatureDate",
            "onBehalf",
            "order",
        ]


class PaperSignatureSerializer(RemoveEmptyFieldsMixin, serializers.ModelSerializer):
    """Serializer for Paper Signature on manifest.

    Indicates the change of custody with paper manifests.
    """

    printedName = serializers.CharField(
        source="printed_name",
        required=False,
    )
    signatureDate = serializers.DateTimeField(
        source="sign_date",
        required=False,
    )

    def update(self, instance, validated_data: dict):
        """Update a PaperSignature object."""
        return super().update(instance, **validated_data)

    def create(self, validated_data: dict):
        """Create a new PaperSignature object."""
        return super().create(**validated_data)

    class Meta:
        """Metaclass."""

        model = PaperSignature
        fields = [
            "printedName",
            "signatureDate",
        ]
