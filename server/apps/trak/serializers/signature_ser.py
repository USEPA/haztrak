from typing import Dict

from rest_framework import serializers

from apps.trak.models import ESignature, PaperSignature, Signer
from apps.trak.serializers.contact_ser import EpaPhoneSerializer
from apps.trak.serializers.trak_ser import TrakBaseSerializer


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
