from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from apps.rcrasite.serializers import RcraSiteSerializer
from apps.rcrasite.serializers.base_serializer import SitesBaseSerializer
from apps.site.models import TrakSite, TrakSiteAccess


class TrakSiteSerializer(ModelSerializer):
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
        model = TrakSite
        fields = ["name", "handler"]


class TrakSiteAccessSerializer(SitesBaseSerializer):
    class Meta:
        model = TrakSiteAccess
        fields = [
            "site",
            "eManifest",
        ]

    site = TrakSiteSerializer()
    eManifest = serializers.CharField(
        source="emanifest",
    )
