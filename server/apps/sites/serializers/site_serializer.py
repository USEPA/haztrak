from rest_framework import serializers

from apps.sites.models import HaztrakOrg, HaztrakSite, RcraSite
from apps.sites.serializers import AddressSerializer, ContactSerializer, RcraPhoneSerializer

from .base_serializer import SitesBaseSerializer


class RcraSiteSerializer(SitesBaseSerializer):
    """
    RcraSite model serializer for JSON marshalling/unmarshalling
    """

    epaSiteId = serializers.CharField(
        source="epa_id",
    )
    # ToDo: we want to serialize based on the display name
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
    emergencyPhone = RcraPhoneSerializer(
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
        model = RcraSite
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


class HaztrakSiteSerializer(SitesBaseSerializer):
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


class HaztrakOrgSerializer(SitesBaseSerializer):
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
