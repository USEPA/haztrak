from rest_framework import serializers

from apps.trak.models import Site
from apps.trak.serializers import HandlerSerializer


class SiteSerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        required=False
    )
    siteHandler = HandlerSerializer(
        source='epa_site'
    )

    class Meta:
        model = Site
        fields = [
            'name',
            'siteHandler'
        ]
