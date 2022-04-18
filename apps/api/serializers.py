from rest_framework import serializers

from apps.trak.models import Manifest


class ManifestSerializer(serializers.ModelSerializer):

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        return Manifest.objects.create(**validated_data)

    class Meta:
        model = Manifest
        fields = '__all__'
