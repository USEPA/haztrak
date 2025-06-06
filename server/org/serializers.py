"""Organization and Site model serializers for JSON marshalling/unmarshalling."""

from org.models import Org, Site
from rcrasite.serializers import RcraSiteSerializer
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer


class OrgSerializer(ModelSerializer):
    """Haztrak Organization Model Serializer."""

    id = serializers.CharField(
        required=False,
    )
    name = serializers.CharField(
        required=False,
    )
    slug = serializers.SlugField(
        required=False,
    )
    rcrainfoIntegrated = serializers.BooleanField(
        source="is_rcrainfo_integrated",
        required=False,
    )

    class Meta:
        """Metaclass."""

        model = Org
        fields = [
            "name",
            "id",
            "slug",
            "rcrainfoIntegrated",
        ]


class SiteSerializer(ModelSerializer):
    """Haztrak Site model serializer for JSON marshalling/unmarshalling."""

    name = serializers.CharField(
        required=False,
    )
    handler = RcraSiteSerializer(
        source="rcra_site",
    )

    class Meta:
        """Metaclass."""

        model = Site
        fields = ["name", "handler"]
