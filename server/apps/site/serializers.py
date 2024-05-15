from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from apps.rcrasite.serializers import RcraSiteSerializer
from apps.rcrasite.serializers.base_serializer import SitesBaseSerializer
from apps.site.models import Site, SiteAccess


class SiteSerializer(ModelSerializer):
    """
    Haztrak Site model serializer for JSON marshalling/unmarshalling
    """

    name = serializers.CharField(
        required=False,
    )
    handler = RcraSiteSerializer(
        source="rcra_site",
    )

    class Meta:
        model = Site
        fields = ["name", "handler"]


class SiteAccessSerializer(SitesBaseSerializer):
    class Meta:
        model = SiteAccess
        fields = [
            "site",
            "eManifest",
        ]

    site = SiteSerializer()
    eManifest = serializers.CharField(
        source="emanifest",
    )
