from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from orgsite.models import Site
from rcrasite.serializers import RcraSiteSerializer


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
