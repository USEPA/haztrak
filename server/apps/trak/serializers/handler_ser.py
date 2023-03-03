from rest_framework import serializers

from apps.trak.models import Handler, ManifestHandler
from apps.trak.serializers import AddressSerializer

from .contact_ser import ContactSerializer, EpaPhoneSerializer
from .trak_ser import TrakBaseSerializer


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
    electronicSignatureInfo = serializers.JSONField(
        source="electronic_signatures_info",
        allow_null=True,
        default=None,
    )
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

    def create(self, validated_data):
        return Handler.objects.create_handler(**validated_data)

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
            "electronicSignatureInfo",
            "registered",
            "limitedEsign",
            "canEsign",
            "hasRegisteredEmanifestUser",
            "gisPrimary",
        ]


class ManifestHandlerSerializer(HandlerSerializer):
    """Serializer for Handler on manifest"""

    handler = HandlerSerializer()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        handler_rep = representation.pop("handler")
        for key in handler_rep:
            representation[key] = handler_rep[key]
        return representation

    def to_internal_value(self, data):
        instance = {"handler": data}
        return super().to_internal_value(instance)

    class Meta:
        model = ManifestHandler
        fields = ["handler"]
