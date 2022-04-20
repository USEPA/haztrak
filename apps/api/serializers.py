from rest_framework import serializers

from apps.trak.models import Manifest, Handler


class HandlerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Handler
        fields = '__all__'


class ManifestSerializer(serializers.ModelSerializer):
    generator = HandlerSerializer()

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        gen_data = validated_data.pop("generator")
        generator_object = Handler.objects.create(**gen_data)
        manifest = Manifest.objects.create(generator=generator_object, **validated_data)
        return manifest

    class Meta:
        model = Manifest
        fields = '__all__'
