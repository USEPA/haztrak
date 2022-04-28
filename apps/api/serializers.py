from rest_framework import serializers

from apps.trak.models import Manifest, Handler


class HandlerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Handler
        fields = '__all__'


class ManifestSerializer(serializers.ModelSerializer):
    manifestTrackingNumber = serializers.CharField(source='mtn')
    createdDate = serializers.DateTimeField(source='created_date')
    updatedDate = serializers.DateTimeField(source='update_date')
    submissionType = serializers.CharField(source='submission_type')
    originType = serializers.CharField(source='origin_type')
    shippedDate = serializers.DateTimeField(source='shipped_date')
    receivedDate = serializers.DateTimeField(source='received_date')
    generator = HandlerSerializer()
    designatedFacility = HandlerSerializer(source='tsd')
    additionalInfo = serializers.JSONField(source='additional_info')

    # printedDocument = serializers.JSONField(source='printed_document')

    # residueNewManifestTrackingNumbers = serializers.JSONField(source='residue_new_mtn')

    # import = serializers.BooleanField(source='import_flag')

    class Meta:
        model = Manifest
        fields = [
            'createdDate',
            'updatedDate',
            'manifestTrackingNumber',
            'status',
            'discrepancy',
            'submissionType',
            'originType',
            'shippedDate',
            'receivedDate',
            'generator',
            'transporters',
            'designatedFacility',
            'wastes',
            'additionalInfo',
            # 'printedDocument',
            # 'rejection',
            # 'residue',
            # 'residueNewManifestTrackingNumbers',
        ]
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
