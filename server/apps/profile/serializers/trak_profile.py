from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from apps.org.serializers import TrakOrgSerializer
from apps.profile.models import TrakProfile
from apps.site.serializers import SiteAccessSerializer


class TrakProfileSerializer(ModelSerializer):
    """Serializer for a user's profile"""

    user = serializers.StringRelatedField(
        required=False,
    )
    sites = SiteAccessSerializer(
        source="user.site_permissions",
        many=True,
    )
    org = TrakOrgSerializer(
        source="user.org_permissions.org",
        required=False,
    )

    class Meta:
        model = TrakProfile
        fields = [
            "user",
            "sites",
            "org",
        ]
