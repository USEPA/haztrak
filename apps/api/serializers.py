from rest_framework import serializers

from apps.trak.models import Manifest, Handler


class HandlerSerializer(serializers.ModelSerializer):
    # siteType TODO
    epaSiteId = serializers.CharField(source='epa_id')
    modified = serializers.BooleanField(allow_null=True,
                                        default=False)
    # name
    mailingAddress = serializers.JSONField(source='mailing_address')
    siteAddress = serializers.JSONField(source='site_address')
    # contact
    emergencyPhone = serializers.JSONField(source='emergency_phone',
                                           allow_null=True,
                                           default=None)
    # paperSignatureInfo TODO
    electronicSignatureInfo = serializers.JSONField(source='electronic_signatures_info',
                                                    allow_null=True,
                                                    default=None)
    # order TODO
    registered = serializers.BooleanField(allow_null=True,
                                          default=False)
    limitedEsign = serializers.BooleanField(source='limited_esign',
                                            allow_null=True,
                                            default=False)
    canEsign = serializers.BooleanField(source='can_esign',
                                        allow_null=True,
                                        default=False)
    hasRegisteredEmanifestUser = serializers.BooleanField(source='registered_emanifest_user',
                                                          allow_null=True,
                                                          default=False)
    gisPrimary = serializers.BooleanField(source='gis_primary',
                                          allow_null=True,
                                          default=False)

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
    # Model field names that map directly to the manifest.json schema and meet django-rest-framework defaults
    # can just be included in the Meta.fields. They are included in the comments to show where they should be
    # implemented if need be
    createdDate = serializers.DateTimeField(source='created_date')
    updatedDate = serializers.DateTimeField(source='update_date')
    manifestTrackingNumber = serializers.CharField(source='mtn')
    # status
    submissionType = serializers.CharField(source='submission_type')
    signatureStatus = serializers.BooleanField(source='signature_status',
                                               allow_null=True,
                                               default=False)
    originType = serializers.CharField(source='origin_type')
    shippedDate = serializers.DateTimeField(source='shipped_date')
    potentialShipDate = serializers.CharField(source='potential_ship_date')
    receivedDate = serializers.DateTimeField(source='received_date')
    certifiedDate = serializers.DateTimeField(source='certified_date',
                                              allow_null=True,
                                              default=None)
    certifiedBy = serializers.JSONField(source='certified_by',
                                        allow_null=True,
                                        default=None)
    generator = HandlerSerializer()
    # transporters = TODO
    designatedFacility = HandlerSerializer(source='tsd')
    # broker = TODO
    # wastes = TODO
    # rejection
    rejectionInfo = serializers.JSONField(source='rejection_info',
                                          allow_null=True,
                                          default=None)
    # discrepancy
    # residue
    residueNewManifestTrackingNumbers = serializers.JSONField(source='residue_new_mtn',
                                                              allow_null=True,
                                                              default=None)
    # import = TODO
    importInfo = serializers.JSONField(source='import_info',
                                       allow_null=True,
                                       default=None)
    containsPreviousRejectOrResidue = serializers.BooleanField(source='contains_residue_or_rejection')
    printedDocument = serializers.JSONField(source='printed_document',
                                            allow_null=True,
                                            default=None)
    formDocument = serializers.JSONField(source='form_document',
                                         allow_null=True,
                                         default=None)
    additionalInfo = serializers.JSONField(source='additional_info',
                                           allow_null=True,
                                           default=None)
    correctionInfo = serializers.JSONField(source='correction_info',
                                           allow_null=True,
                                           default=None)

    ppcStatus = serializers.JSONField(source='ppc_status',
                                      allow_null=True,
                                      default=None)
    # mtnValidationInfo
    # provideImageGeneratorInfo
    locked = serializers.BooleanField(allow_null=True,
                                      default=False)

    lockedReason = serializers.CharField(source='locked_reason',
                                         allow_null=True,
                                         default=None)

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

    def create(self, validated_data):
        tsd_data = validated_data.pop('tsd')
        tsd_object = Handler.objects.create(**tsd_data)
        gen_data = validated_data.pop('generator')
        gen_object = Handler.objects.create(**gen_data)
        manifest = Manifest.objects.create(generator=gen_object,
                                           tsd=tsd_object,
                                           **validated_data)
        return manifest
