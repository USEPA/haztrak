# Any serialization of deserialization of Haztrak objects to or from JSON
# goes through these django-rest-framework serializers
# this way if changes to the model occur, we don't need to change another
# utility function that just reads JSON and create model instances

# Comments are included in each serializer where fields have not implemented
# this is either because ModelSerializer's defaults are sufficient or
# they are left as a TODO item
from rest_framework import serializers

from apps.trak.models import Handler, Manifest

from . import HandlerSerializer


class ManifestSerializer(serializers.ModelSerializer):
    createdDate = serializers.DateTimeField(
        source='created_date')
    updatedDate = serializers.DateTimeField(
        source='update_date')
    manifestTrackingNumber = serializers.CharField(
        source='mtn')
    # status
    submissionType = serializers.CharField(
        source='submission_type')
    signatureStatus = serializers.BooleanField(
        source='signature_status',
        allow_null=True,
        default=False)
    originType = serializers.CharField(
        source='origin_type')
    shippedDate = serializers.DateTimeField(
        source='shipped_date')
    potentialShipDate = serializers.CharField(
        source='potential_ship_date')
    receivedDate = serializers.DateTimeField(
        source='received_date')
    certifiedDate = serializers.DateTimeField(
        source='certified_date',
        allow_null=True,
        default=None)
    certifiedBy = serializers.JSONField(
        source='certified_by',
        allow_null=True,
        default=None)
    generator = HandlerSerializer()
    transporters = HandlerSerializer(many=True)
    designatedFacility = HandlerSerializer(
        source='tsd')
    # broker TODO
    # wastes
    # rejection
    rejectionInfo = serializers.JSONField(
        source='rejection_info',
        allow_null=True,
        default=None)
    # discrepancy
    # residue
    residueNewManifestTrackingNumbers = serializers.JSONField(
        source='residue_new_mtn',
        default=[])
    # import, see .to_representation() and .to_internal_value() methods
    importInfo = serializers.JSONField(
        source='import_info',
        allow_null=True,
        default=None)
    containsPreviousRejectOrResidue = serializers.BooleanField(
        source='contains_residue_or_rejection')
    printedDocument = serializers.JSONField(
        source='printed_document',
        allow_null=True,
        default=None)
    formDocument = serializers.JSONField(
        source='form_document',
        allow_null=True,
        default=None)
    additionalInfo = serializers.JSONField(
        source='additional_info',
        allow_null=True,
        default=None)
    correctionInfo = serializers.JSONField(
        source='correction_info',
        allow_null=True,
        default=None)

    ppcStatus = serializers.JSONField(
        source='ppc_status',
        allow_null=True,
        default=None)
    # mtnValidationInfo
    # provideImageGeneratorInfo
    locked = serializers.BooleanField(
        allow_null=True,
        default=False)

    lockedReason = serializers.CharField(
        source='locked_reason',
        allow_null=True,
        default=None)

    def create(self, validated_data) -> Manifest:
        tsd_data = validated_data.pop('tsd')
        tsd_object = Handler.objects.create(**tsd_data)
        gen_data = validated_data.pop('generator')
        trans_data = validated_data.pop('transporters')
        gen_object = Handler.objects.create(**gen_data)
        manifest = Manifest.objects.create(generator=gen_object,
                                           tsd=tsd_object,
                                           **validated_data)
        transporters = []
        for i in trans_data:
            tran = Handler.objects.create(**i)
            transporters.append(tran)
        manifest.transporters.add(*transporters)
        return manifest

    # https://www.django-rest-framework.org/api-guide/serializers/#overriding-serialization-and-deserialization-behavior
    def to_representation(self, instance):
        data = super(ManifestSerializer, self).to_representation(instance)
        data['import'] = instance.import_flag
        # remove null fields when serializing manifest
        for field in self.fields:
            try:
                if data[field] is None:
                    data.pop(field)
            except KeyError:
                pass
        return data

    def to_internal_value(self, data):
        instance = super(ManifestSerializer, self).to_internal_value(data)
        try:
            instance.import_flag = data.get('import')
            return instance
        except KeyError:
            instance.import_flag = False
            return instance

    class Meta:
        model = Manifest
        fields = [
            'createdDate',
            'updatedDate',
            'manifestTrackingNumber',
            'status',
            'submissionType',
            'signatureStatus',
            'originType',
            'shippedDate',
            'potentialShipDate',
            'receivedDate',
            'certifiedDate',
            'certifiedBy',
            'generator',
            'transporters',
            'designatedFacility',
            'broker',
            # 'wastes',
            'rejection',
            'rejectionInfo',
            'discrepancy',
            'residue',
            'residueNewManifestTrackingNumbers',
            # 'import', field conflicts with keyword,  see to_representation method
            'importInfo',
            'containsPreviousRejectOrResidue',
            'printedDocument',
            'formDocument',
            'additionalInfo',
            'correctionInfo',
            'ppcStatus',
            'locked',
            'lockedReason',
        ]
