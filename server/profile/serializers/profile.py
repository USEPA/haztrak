from profile.models import Profile

from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from org.serializers import OrgSerializer


class ProfileSerializer(ModelSerializer):
    """Serializer for a user's profile"""

    user = serializers.StringRelatedField(
        required=False,
    )
    org = OrgSerializer(
        source="user.org_permissions.org",
        required=False,
    )

    class Meta:
        model = Profile
        fields = [
            "user",
            "org",
        ]
