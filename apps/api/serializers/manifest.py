# Any serialization of deserialization of Haztrak objects to or from JSON
# goes through these django-rest-framework serializers
# this way if changes to the model occur, we don't need to change another
# utility function that just reads JSON and create model instances

# Comments are included in each serializer where fields have not implemented
# this is either because ModelSerializer's defaults are sufficient or
# they are left as a TODO item

from rest_framework import serializers

from apps.trak.models import Address, Handler, Manifest, Transporter, WasteLine

from . import HandlerSerializer


class TransporterSerializer(HandlerSerializer):
    class Meta:
        model = Transporter
        fields = [
            'epaSiteId',
            'modified',
            'name',
            'siteAddress',
            'mailingAddress',
            'contact',
            'emergencyPhone',
            'electronicSignatureInfo',
            'order',
            'registered',
            'limitedEsign',
            'canEsign',
            'hasRegisteredEmanifestUser',
            'gisPrimary',
        ]


class WasteLineSerializer(serializers.ModelSerializer):
    lineNumber = serializers.IntegerField(
        source='line_number',
    )
    dotHazardous = serializers.BooleanField(
        source='dot_hazardous',
    )
    dotInformation = serializers.JSONField(
        source='dot_info',
        required=False,
    )
    quantity = serializers.JSONField(
        required=False,
    )
    hazardousWaste = serializers.JSONField(
        source='hazardous_waste',
        required=False,
    )
    # br
    brInfo = serializers.JSONField(
        source='br_info',
        required=False,
    )
    managementMethod = serializers.JSONField(
        source='management_method',
        required=False,
    )
    # pcb
    pcbInfos = serializers.JSONField(
        source='pcb_infos',
        required=False,
    )
    discrepancyResidueInfo = serializers.JSONField(
        source='discrepancy_info',
        required=False,
    )
    epaWaste = serializers.BooleanField(
        source='epa_waste',
    )

    class Meta:
        model = WasteLine
        fields = [
            'lineNumber',
            'dotHazardous',
            'dotInformation',
            'quantity',
            'hazardousWaste',
            'br',
            'brInfo',
            'managementMethod',
            'pcb',
            'pcbInfos',
            'discrepancyResidueInfo',
            'epaWaste',

        ]

    def to_representation(self, instance) -> str:
        data = super(WasteLineSerializer, self).to_representation(instance)
        for field in self.fields:
            try:
                if data[field] is None:
                    data.pop(field)
            except KeyError:
                pass
        return data

    def __str__(self):
        return f'{self.lineNumber}'


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
    transporters = TransporterSerializer(many=True)
    designatedFacility = HandlerSerializer(
        source='tsd')
    # broker
    wastes = WasteLineSerializer(many=True)
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
        # pop foreign table data
        waste_data = validated_data.pop('wastes')
        trans_data = validated_data.pop('transporters')
        tsd_data = validated_data.pop('tsd')
        gen_data = validated_data.pop('generator')
        # Secondary foreign table data
        gen_object = self.create_handler_instance(gen_data)
        tsd_object = self.create_handler_instance(tsd_data)

        # Create model instances
        # gen_object = Handler.objects.create(**gen_data)
        # tsd_object = Handler.objects.create(**tsd_data)
        manifest = Manifest.objects.create(generator=gen_object,
                                           tsd=tsd_object,
                                           **validated_data)
        for transporter in trans_data:
            site_address_data = transporter.pop('site_address')
            mail_address_data = transporter.pop('mail_address')
            site_address = Address.objects.create(**site_address_data)
            mail_address = Address.objects.create(**mail_address_data)
            Transporter.objects.create(manifest=manifest, **transporter,
                                       mail_address=mail_address,
                                       site_address=site_address)
        for waste_line in waste_data:
            WasteLine.objects.create(manifest=manifest, **waste_line)
        return manifest

    def create_handler_instance(self, handler_data: dict) -> Handler:
        site_address_data = handler_data.pop('site_address')
        mail_address_data = handler_data.pop('mail_address')
        site_address = Address.objects.create(**site_address_data)
        mail_address = Address.objects.create(**mail_address_data)
        new_handler = Handler.objects.create(site_address=site_address,
                                             mail_address=mail_address,
                                             **handler_data)
        return new_handler

    # https://www.django-rest-framework.org/api-guide/serializers/#overriding-serialization-and-deserialization-behavior
    def to_representation(self, instance) -> str:
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
