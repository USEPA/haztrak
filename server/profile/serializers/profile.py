from profile.models import Profile

from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from org.serializers import OrgSerializer
from orgsite.serializers import SiteAccessSerializer


class ProfileSerializer(ModelSerializer):
    """Serializer for a user's profile"""

    user = serializers.StringRelatedField(
        required=False,
    )
    sites = SiteAccessSerializer(
        source="user.site_permissions",
        many=True,
    )
    org = OrgSerializer(
        source="user.org_permissions.org",
        required=False,
    )

    class Meta:
        model = Profile
        fields = [
            "user",
            "sites",
            "org",
        ]
