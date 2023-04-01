from rest_framework import serializers

from apps.sites.models import Site
from apps.trak.serializers import EpaSiteSerializer

from .base_ser import TrakBaseSerializer


class SiteSerializer(TrakBaseSerializer):
    """
    Site model serializer for JSON marshalling/unmarshalling
    """

    name = serializers.CharField(
        required=False,
    )
    handler = EpaSiteSerializer(
        source="epa_site",
    )

    class Meta:
        model = Site
        fields = ["name", "handler"]
