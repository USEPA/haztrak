from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from apps.trak.models import RcraProfile, SitePermission
from apps.trak.serializers.trak import TrakBaseSerializer


class ProfileGetSerializer(ModelSerializer):
    """
    Rcra Profile model serializer for JSON marshalling/unmarshalling
    """
    user = serializers.StringRelatedField()
    epaSites = serializers.StringRelatedField(
        required=False,
        source='epa_sites',
        many=True,
    )
    phoneNumber = serializers.CharField(
        required=False,
        source='phone_number',
    )
    rcraAPIID = serializers.CharField(
        required=False,
        source='rcra_api_id',
    )
    rcraUsername = serializers.CharField(
        required=False,
        source='rcra_username',
    )

    class Meta:
        model = RcraProfile
        fields = [
            'user',
            'rcraAPIID',
            'rcraUsername',
            'epaSites',
            'phoneNumber',
        ]


class ProfileUpdateSerializer(ProfileGetSerializer):
    """
    Adds the users RCRAInfo API Key to the trak Profile serializer to be used
    for post and update request (not for GET requests).
    """
    rcraAPIKey = serializers.CharField(
        required=False,
        source='rcra_api_key',
    )

    class Meta:
        model = RcraProfile
        fields = [
            'user',
            'rcraAPIID',
            'rcraAPIKey',
            'rcraUsername',
            'epaSites',
            'phoneNumber',
        ]


class SitePermissionSerializer(TrakBaseSerializer):
    """
    SitePermission model serializer for JSON marshalling/unmarshalling
    We use this internally because it's easier to handle, Haztrak has a separate
    serializer for user permissions from RCRAInfo. See EpaPermissionSerializer.
    """
    siteManagement = serializers.BooleanField(
        source='site_manager'
    )
    annualReport = serializers.CharField(
        source='annual_report',
    )
    biennialReport = serializers.CharField(
        source='biennial_report',
    )
    eManifest = serializers.CharField(
        source='e_manifest',
    )
    WIETS = serializers.CharField(
        source='wiets',
    )
    myRCRAid = serializers.CharField(
        source='my_rcra_id',
    )

    class Meta:
        model = SitePermission
        fields = [
            'siteManagement',
            'annualReport',
            'biennialReport',
            'eManifest',
            'WIETS',
            'myRCRAid'
        ]


class SitePermissionField(serializers.Field):

    def to_representation(self, value):
        print(self.field_name)
        ret = {
            "module": f'{self.field_name}',
            "level": value
        }
        return ret


class EpaPermissionSerializer(SitePermissionSerializer):
    """
    SitePermission model serializer specifically for reading a user's site permissions
    from RCRAInfo
    """
    siteId = serializers.CharField(
        source='site'
    )
    annualReport = SitePermissionField(
        source='annual_report',
    )
    biennialReport = SitePermissionField(
        source='biennial_report',
    )
    eManifest = SitePermissionField(
        source='e_manifest',
    )
    WIETS = SitePermissionField(
        source='wiets',
    )
    myRCRAid = SitePermissionField(
        source='my_rcra_id',
    )

    def to_representation(self, instance: SitePermission):
        ret = super().to_representation(instance)
        modules = ['annualReport', 'biennialReport', 'eManifest', 'myRCRAid', 'WIETS']
        ret['permissions'] = []
        for module in modules:
            permission = ret.pop(module)
            ret['permissions'].append(permission)
        return ret

    class Meta:
        model = SitePermission
        fields = [
            'siteId',
            'annualReport',
            'biennialReport',
            'eManifest',
            'WIETS',
            'myRCRAid'
        ]
