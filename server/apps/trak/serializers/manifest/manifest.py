# Any serialization of deserialization of Haztrak objects to or from JSON
# goes through these django-rest-framework serializers
# this way if changes to the model occur, we don't need to change another
# utility function that just reads JSON and create model instances

# Comments are included in each serializer where fields were not implemented
# this is either because ModelSerializer's defaults are sufficient or work is needed to
# be done

from rest_framework import serializers

from apps.trak.models import Handler, Manifest, WasteLine
from apps.trak.serializers.handler import HandlerSerializer
from lib.serializers import TrakSerializer

from .transporter import TransporterSerializer
from .waste_line import WasteLineSerializer


class ManifestSerializer(TrakSerializer):
    createdDate = serializers.DateTimeField(
        source='created_date',
    )
    updatedDate = serializers.DateTimeField(
        source='update_date',
    )
    manifestTrackingNumber = serializers.CharField(
        source='mtn',
    )
    # status
    submissionType = serializers.CharField(
        source='submission_type',
    )
    signatureStatus = serializers.BooleanField(
        source='signature_status',
        allow_null=True,
        default=False,
    )
    originType = serializers.CharField(
        source='origin_type',
    )
    shippedDate = serializers.DateTimeField(
        source='shipped_date',
        required=False,
    )
    potentialShipDate = serializers.CharField(
        source='potential_ship_date',
        required=False,
    )
    receivedDate = serializers.DateTimeField(
        source='received_date',
        required=False,
    )
    certifiedDate = serializers.DateTimeField(
        source='certified_date',
        allow_null=True,
        default=None,
    )
    certifiedBy = serializers.JSONField(
        source='certified_by',
        allow_null=True,
        default=None,
    )
    generator = HandlerSerializer()
    transporters = TransporterSerializer(many=True)
    designatedFacility = HandlerSerializer(
        source='tsd',
    )
    # broker
    wastes = WasteLineSerializer(many=True)
    # rejection
    rejectionInfo = serializers.JSONField(
        source='rejection_info',
        allow_null=True,
        default=None,
    )
    # discrepancy
    # residue
    residueNewManifestTrackingNumbers = serializers.JSONField(
        source='residue_new_mtn',
        default=[],
    )
    # import, see .to_representation() and .to_internal_value() methods
    importInfo = serializers.JSONField(
        source='import_info',
        allow_null=True,
        default=None,
    )
    containsPreviousRejectOrResidue = serializers.BooleanField(
        source='contains_residue_or_rejection',
    )
    printedDocument = serializers.JSONField(
        source='printed_document',
        allow_null=True,
        default=None,
    )
    formDocument = serializers.JSONField(
        source='form_document',
        allow_null=True,
        default=None,
    )
    additionalInfo = serializers.JSONField(
        source='additional_info',
        allow_null=True,
        default=None,
    )
    correctionInfo = serializers.JSONField(
        source='correction_info',
        allow_null=True,
        default=None,
    )
    ppcStatus = serializers.JSONField(
        source='ppc_status',
        allow_null=True,
        default=None,
    )
    # mtnValidationInfo
    # provideImageGeneratorInfo
    locked = serializers.BooleanField(
        allow_null=True,
        default=False,
    )

    lockedReason = serializers.CharField(
        source='locked_reason',
        allow_null=True,
        default=None,
    )

    def create(self, validated_data) -> Manifest:
        # pop foreign table data
        waste_data = validated_data.pop('wastes')
        trans_data = validated_data.pop('transporters')
        tsd_data = validated_data.pop('tsd')
        gen_data = validated_data.pop('generator')
        # Secondary foreign table data
        if Handler.objects.filter(epa_id=gen_data['epa_id']).exists():
            gen_object = Handler.objects.get(epa_id=gen_data['epa_id'])
        else:
            gen_object = self.create_handler(**gen_data)
        if Handler.objects.filter(epa_id=tsd_data['epa_id']).exists():
            tsd_object = Handler.objects.get(epa_id=tsd_data['epa_id'])
        else:
            tsd_object = self.create_handler(**tsd_data)

        # Create model instances
        manifest = Manifest.objects.create(generator=gen_object,
                                           tsd=tsd_object,
                                           **validated_data)
        for transporter in trans_data:
            self.create_transporter(manifest, **transporter)
        for waste_line in waste_data:
            WasteLine.objects.create(manifest=manifest, **waste_line)
        return manifest

    # https://www.django-rest-framework.org/api-guide/serializers/#overriding-serialization-and-deserialization-behavior
    def to_representation(self, instance) -> str:
        data = super(ManifestSerializer, self).to_representation(instance)
        data['import'] = instance.import_flag
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
            'wastes',
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
