from typing import Dict

from rest_framework import serializers

from apps.trak.models import Handler, ManifestHandler
from apps.trak.serializers import AddressSerializer

from .base_ser import TrakBaseSerializer
from .contact_ser import ContactSerializer, EpaPhoneSerializer
from .signature_ser import ESignatureSerializer, PaperSignatureSerializer


class HandlerSerializer(TrakBaseSerializer):
    """
    Handler model serializer for JSON marshalling/unmarshalling
    """

    epaSiteId = serializers.CharField(
        source="epa_id",
    )
    siteType = serializers.CharField(
        source="site_type",
        allow_null=True,
        required=False,
    )
    modified = serializers.BooleanField(
        allow_null=True,
        default=False,
    )
    # name
    mailingAddress = AddressSerializer(
        source="mail_address",
    )
    siteAddress = AddressSerializer(
        source="site_address",
    )
    contact = ContactSerializer()
    emergencyPhone = EpaPhoneSerializer(
        source="emergency_phone",
        allow_null=True,
        default=None,
    )
    # paperSignatureInfo
    registered = serializers.BooleanField(
        allow_null=True,
        default=False,
    )
    limitedEsign = serializers.BooleanField(
        source="limited_esign",
        allow_null=True,
        default=False,
    )
    canEsign = serializers.BooleanField(
        source="can_esign",
        allow_null=True,
        default=False,
    )
    hasRegisteredEmanifestUser = serializers.BooleanField(
        source="registered_emanifest_user",
        allow_null=True,
        default=False,
    )
    gisPrimary = serializers.BooleanField(
        source="gis_primary",
        allow_null=True,
        default=False,
    )

    def update(self, instance, validated_data):
        return self.Meta.model.objects.save(**validated_data)

    def create(self, validated_data):
        return self.Meta.model.objects.save(**validated_data)

    class Meta:
        model = Handler
        fields = [
            "epaSiteId",
            "siteType",
            "modified",
            "name",
            "siteAddress",
            "mailingAddress",
            "contact",
            "emergencyPhone",
            "registered",
            "limitedEsign",
            "canEsign",
            "hasRegisteredEmanifestUser",
            "gisPrimary",
        ]


class ManifestHandlerSerializer(HandlerSerializer):
    """Serializer for Handler on manifest"""

    handler = HandlerSerializer()
    electronicSignaturesInfo = ESignatureSerializer(
        source="e_signatures",
        many=True,
        required=False,
    )
    paperSignatureInfo = PaperSignatureSerializer(
        source="paper_signature",
        required=False,
    )
    signed = serializers.ReadOnlyField()

    def update(self, instance, validated_data: Dict):
        return self.Meta.model.objects.update(instance, **validated_data)

    def create(self, validated_data: Dict):
        return self.Meta.model.objects.save(**validated_data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        handler_rep = representation.pop("handler")
        for key in handler_rep:
            representation[key] = handler_rep[key]
        return representation

    def to_internal_value(self, data: Dict):
        instance = {}
        if "electronicSignaturesInfo" in data:
            instance["electronicSignaturesInfo"] = data.pop("electronicSignaturesInfo")
        if "paperSignatureInfo" in data:
            instance["paperSignatureInfo"] = data.pop("paperSignatureInfo")
        instance["handler"] = data
        if "order" in instance["handler"]:
            instance["order"] = instance["handler"]["order"]
        return super().to_internal_value(instance)

    class Meta:
        model = ManifestHandler
        fields = [
            "handler",
            "electronicSignaturesInfo",
            "paperSignatureInfo",
            "signed",
        ]
