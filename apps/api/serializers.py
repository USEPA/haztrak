from rest_framework import serializers
from apps.trak.models import Manifest, ManifestSimple
from rcrainfo import global_choices as ri


class ManifestSerializer(serializers.ModelSerializer):
    manifest_tracking_number = serializers.CharField(source='manifestTrackingNumber')

    class Meta:
        model = Manifest
        fields = '__all__'
        # fields = ['id', 'manifest_tracking_number', 'transporter']


class TestSerializer(serializers.Serializer):
    manifestTrackingNumber = serializers.CharField(max_length=15)
    createdDate = serializers.DateTimeField()
    status = serializers.ChoiceField(choices=ri.STATUS, default='notAssigned')

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        return ManifestSimple.objects.create(**validated_data)