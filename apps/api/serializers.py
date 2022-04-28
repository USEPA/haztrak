from rest_framework import serializers

from apps.trak.models import Manifest, Handler


class HandlerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Handler
        fields = '__all__'


class ManifestSerializer(serializers.ModelSerializer):
    manifestTrackingNumber = serializers.CharField(source='mtn')

    class Meta:
        model = Manifest
        fields = ['manifestTrackingNumber']
    # generator = HandlerSerializer()
    #
    # def update(self, instance, validated_data):
    #     pass
    #
    # def create(self, validated_data):
    #     gen_data = validated_data.pop("generator")
    #     tsd_data = validated_data.pop('designatedFacility')
    #     generator_object = Handler.objects.create(**gen_data)
    #     tsd_object = Handler.objects.create(**tsd_data)
    #     manifest = Manifest.objects.create(generator=generator_object,
    #                                        designatedFacility=tsd_object,
    #                                        **validated_data)
    #     return manifest
    #
    # class Meta:
    #     model = Manifest
    #     fields = '__all__'
