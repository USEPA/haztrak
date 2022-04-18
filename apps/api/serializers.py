from rest_framework import serializers

from apps.trak.models import Manifest, ManifestSimple


class ManifestSerializer(serializers.ModelSerializer):
    manifest_tracking_number = serializers.CharField(source='manifestTrackingNumber')

    class Meta:
        model = Manifest
        fields = '__all__'
        # fields = ['id', 'manifest_tracking_number', 'transporter']


class TestSerializer(serializers.ModelSerializer):

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        return ManifestSimple.objects.create(**validated_data)

    class Meta:
        model = ManifestSimple
        fields = '__all__'
