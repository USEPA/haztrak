from datetime import timezone
from typing import Dict

from rest_framework import serializers

from apps.sites.serializers.contact_ser import EpaPhoneSerializer
from apps.trak.models import ESignature, PaperSignature, QuickerSign, Signer

from .base_ser import TrakBaseSerializer


class QuickerSignSerializer(serializers.Serializer):
    """Serializer for EPA Quicker Sign objects"""

    manifestTrackingNumbers = serializers.ListField(source="mtn", child=serializers.CharField())
    printedSignatureName = serializers.CharField(source="printed_name")
    printedSignatureDate = serializers.DateTimeField(
        source="printed_date",
        required=False,
        default_timezone=timezone.utc,
        format=None,
    )
    siteType = serializers.CharField(source="site_type")
    siteId = serializers.CharField(source="site_id")
    transporterOrder = serializers.IntegerField(source="transporter_order", required=False)

    def to_internal_value(self, data: Dict):
        return super().to_internal_value(data)

    def to_representation(self, instance: QuickerSign):
        data = super().to_representation(instance)
        data["printedSignatureDate"] = instance.printed_date.isoformat(timespec="milliseconds")
        return data

    def update(self, instance, validated_data):
        return self.Meta.model(**validated_data)

    def create(self, validated_data):
        return self.Meta.model(**validated_data)

    class Meta:
        model = QuickerSign
        fields = [
            "printedSignatureName",
            "printedSignatureDate",
            "siteType",
            "siteId",
            "transporterOrder",
        ]


class SignerSerializer(TrakBaseSerializer):
    """Serializer for EPA Signer Object"""

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
    phone = EpaPhoneSerializer(
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


class ESignatureSerializer(TrakBaseSerializer):
    """Serializer for Electronic Signature on manifest"""

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
        return super().update(instance, validated_data)

    def create(self, validated_data: Dict):
        return self.Meta.model.objects.save(**validated_data)

    class Meta:
        model = ESignature
        fields = [
            "signer",
            "cromerrActivityId",
            "cromerrDocumentId",
            "signatureDate",
            "onBehalf",
            "order",
        ]


class PaperSignatureSerializer(TrakBaseSerializer):
    """
    Serializer for Paper Signature on manifest which indicates the change
    of custody with paper manifests
    """

    printedName = serializers.CharField(
        source="printed_name",
        required=False,
    )
    signatureDate = serializers.DateTimeField(
        source="sign_date",
        required=False,
    )

    def update(self, instance, validated_data: Dict):
        return super().update(instance, **validated_data)

    def create(self, validated_data: Dict):
        return super().create(**validated_data)

    class Meta:
        model = PaperSignature
        fields = [
            "printedName",
            "signatureDate",
        ]
