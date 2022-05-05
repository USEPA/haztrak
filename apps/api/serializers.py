# Any serialization of deserialization of Haztrak objects to or from JSON
# goes through these django-rest-framework serializers
# this way if changes to the model occur, we don't need to change another
# utility function that just reads JSON and create model instances

# Comments are included in each serializer where fields have not implemented
# this is either because ModelSerializer's defaults are sufficient or
# they are left as a TODO item
from rest_framework import serializers
from apps.trak.models import Manifest, Handler, Address


class AddressSerializer(serializers.ModelSerializer):
    streetNumber = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True,
        source='street_number')
    address1 = serializers.CharField()
    address2 = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True)
    city = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True)
    state = serializers.JSONField(
        required=False,
        allow_null=True)
    country = serializers.JSONField(
        required=False,
        allow_null=True)
    zip = serializers.CharField(
        required=False,
        allow_blank=True)

    class Meta:
        model = Address
        fields = [
            'streetNumber',
            'address1',
            'address2',
            'city',
            'state',
            'country',
            'zip',
        ]


class HandlerSerializer(serializers.ModelSerializer):
    # siteType TODO
    epaSiteId = serializers.CharField(
        source='epa_id')
    modified = serializers.BooleanField(
        allow_null=True,
        default=False)
    # name
    mailingAddress = serializers.JSONField(
        source='mailing_address')
    siteAddress = AddressSerializer(source='site_address')
    # contact
    emergencyPhone = serializers.JSONField(
        source='emergency_phone',
        allow_null=True,
        default=None)
    # paperSignatureInfo TODO
    electronicSignatureInfo = serializers.JSONField(
        source='electronic_signatures_info',
        allow_null=True,
        default=None)
    # order TODO
    registered = serializers.BooleanField(
        allow_null=True,
        default=False)
    limitedEsign = serializers.BooleanField(
        source='limited_esign',
        allow_null=True,
        default=False)
    canEsign = serializers.BooleanField(
        source='can_esign',
        allow_null=True,
        default=False)
    hasRegisteredEmanifestUser = serializers.BooleanField(
        source='registered_emanifest_user',
        allow_null=True,
        default=False)
    gisPrimary = serializers.BooleanField(
        source='gis_primary',
        allow_null=True,
        default=False)

    def create(self, validated_data):
        print("from HandlerSerializer.create", validated_data)
        site_address_data = validated_data.pop('site_address')
        site_instance = Address.objects.create(**site_address_data)
        handler = Handler.objects.create(site_address=site_instance, **validated_data)
        return handler

    # Override method to remove null fields when serializing
    def to_representation(self, instance):
        data = super().to_representation(instance)
        for field in self.fields:
            try:
                if data[field] is None:
                    data.pop(field)
            except KeyError:
                pass
        return data

    class Meta:
        model = Handler
        fields = [
            'epaSiteId',
            'modified',
            'name',
            'mailingAddress',
            'siteAddress',
            'contact',
            'emergencyPhone',
            # 'paperSignatureInfo',
            'electronicSignatureInfo',
            # 'order',
            'registered',
            'limitedEsign',
            'canEsign',
            'hasRegisteredEmanifestUser',
            'gisPrimary',
        ]


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
    # transporters TODO
    designatedFacility = HandlerSerializer(
        source='tsd')
    # broker TODO
    # wastes TODO
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
        tsd_site = tsd_data.pop('site_address')
        site_address_object = Address.objects.create(**tsd_site)
        tsd_object = Handler.objects.create(site_address=site_address_object,
                                            **tsd_data)
        gen_data = validated_data.pop('generator')
        gen_site = gen_data.pop('site_address')
        site_address_object = Address.objects.create(**gen_site)
        gen_object = Handler.objects.create(site_address=site_address_object,
                                            **gen_data)
        # gen_object = Handler.objects.create(**gen_data)
        manifest = Manifest.objects.create(generator=gen_object,
                                           tsd=tsd_object,
                                           **validated_data)
        return manifest

    # overriding to_representation and to_internal_value method to alter behavior for 'import' field
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
            'wastes',
            'rejection',
            'rejectionInfo',
            'discrepancy',
            'residue',
            'residueNewManifestTrackingNumbers',
            # 'import', Boolean field conflicts with import keyword
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
