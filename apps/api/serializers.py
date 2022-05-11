# Any serialization of deserialization of Haztrak objects to or from JSON
# goes through these django-rest-framework serializers
# this way if changes to the model occur, we don't need to change another
# utility function that just reads JSON and create model instances

# Comments are included in each serializer where fields have not implemented
# this is either because ModelSerializer's defaults are sufficient or
# they are left as a TODO item
from rest_framework import serializers

from apps.trak.models import Handler, Manifest
from lib.rcrainfo.lookups import get_country_name, get_state_name


# TODO remove duplication of MailAddressField and SiteAddressField
class MailAddressField(serializers.Field):
    def to_representation(self, value):
        state_name = get_state_name(value.mail_state)
        country_name = get_country_name(value.mail_country)
        mail_address = {"streetNumber": value.mail_street_number,
                        "address1": value.mail_address1,
                        "address2": value.mail_address2,
                        "city": value.mail_city,
                        "state": {
                            "code": value.mail_state,
                            "name": state_name,
                        },
                        "country": {
                            "code": value.mail_country,
                            "name": country_name,
                        },
                        "zip": value.mail_zip
                        }
        # remove nulls when serializing for fun
        for key, value in dict(mail_address).items():
            if value is None:
                try:
                    del mail_address[key]
                except KeyError:
                    pass
        return mail_address

    def to_internal_value(self, data):
        address = {}
        try:
            address = {'mail_address1': data['address1'],
                       'mail_state': data['state']['code'],
                       'mail_country': data['country']['code']}
        except KeyError:
            pass
        return address


class SiteAddressField(serializers.Field):
    def to_representation(self, value):
        state_name = get_state_name(value.site_state)
        country_name = get_country_name(value.site_country)
        site_address = {"streetNumber": value.site_street_number,
                        "address1": value.site_address1,
                        "address2": value.site_address2,
                        "city": value.site_city,
                        "state": {
                            "code": value.site_state,
                            "name": state_name,
                        },
                        "country": {
                            "code": value.site_country,
                            "name": country_name,
                        },
                        "zip": value.site_zip
                        }
        # remove nulls when serializing for fun
        for key, value in dict(site_address).items():
            if value is None:
                try:
                    del site_address[key]
                except KeyError:
                    pass
        return site_address

    def to_internal_value(self, data):
        address = {}
        try:
            address = {'site_address1': data['address1'],
                       'site_state': data['state']['code'],
                       'site_country': data['country']['code']}
        except KeyError:
            pass
        return address


class HandlerSerializer(serializers.ModelSerializer):
    # siteType TODO
    epaSiteId = serializers.CharField(
        source='epa_id')
    modified = serializers.BooleanField(
        allow_null=True,
        default=False)
    # name
    mailingAddress = MailAddressField(
        source='*')
    siteAddress = SiteAddressField(
        source='*')
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
        tsd_object = Handler.objects.create(**tsd_data)
        gen_data = validated_data.pop('generator')
        gen_object = Handler.objects.create(**gen_data)
        manifest = Manifest.objects.create(generator=gen_object,
                                           tsd=tsd_object,
                                           **validated_data)
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
