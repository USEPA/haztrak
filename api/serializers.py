from rest_framework import serializers
from trak.models import Manifest


class ManifestSerializer(serializers.ModelSerializer):

    class Meta:
        model = Manifest
        fields = ['id', 'manifest_tracking_number']
