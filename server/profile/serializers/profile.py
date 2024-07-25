from profile.models import Profile

from rest_framework import serializers
from rest_framework.serializers import ModelSerializer


class ProfileSerializer(ModelSerializer):
    """Serializer for a user's profile"""

    user = serializers.StringRelatedField(
        required=False,
    )

    class Meta:
        model = Profile
        fields = [
            "user",
        ]
