from rest_framework import serializers

from apps.trak.models import Site
from apps.trak.serializers import HandlerSerializer
from apps.trak.serializers.trak import TrakBaseSerializer


class SiteSerializer(TrakBaseSerializer):
    """
    Site model serializer for JSON marshalling/unmarshalling
    """

    name = serializers.CharField(required=False)
    handler = HandlerSerializer(source="epa_site")

    class Meta:
        model = Site
        fields = ["name", "handler"]
