from rest_framework import serializers
from rest_framework.exceptions import APIException
from rest_framework.serializers import ModelSerializer

from apps.trak.models import RcraProfile, Site, SitePermission
from apps.trak.serializers.trak import TrakBaseSerializer

from .sites import SiteSerializer


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


class EpaPermissionField(serializers.Field):
    """
    Serializer for communicating with RCRAInfo, translates Haztrak's
    storage to the way RCRAInfo describes a user's permissions for a
    specific module for the given site. (ToDo: reword this description)
    """

    def to_representation(self, value):
        if value:
            value = 'Active'
        elif not value:
            value = 'InActive'
        ret = {
            "module": f'{self.field_name}',
            "level": value
        }
        return ret

    def to_internal_value(self, data):
        data = data['level']
        if data == 'Active':
            data = True
        elif data == 'InActive':
            data = False
        return data


class EpaPermissionSerializer(SitePermissionSerializer):
    modules = ['AnnualReport', 'BiennialReport', 'eManifest', 'myRCRAid', 'WIETS', 'SiteManagement']
    """
    SitePermission model serializer specifically for reading a user's site permissions
    from RCRAInfo
    """
    siteId = SiteSerializer(
        source='site'
    )
    SiteManagement = EpaPermissionField(
        source='site_manager'
    )
    AnnualReport = EpaPermissionField(
        source='annual_report',
    )
    BiennialReport = EpaPermissionField(
        source='biennial_report',
    )
    eManifest = EpaPermissionField(
        source='e_manifest',
    )
    WIETS = EpaPermissionField(
        source='wiets',
    )
    myRCRAid = EpaPermissionField(
        source='my_rcra_id',
    )

    def to_representation(self, instance: SitePermission):
        try:
            ret = super().to_representation(instance)
            ret['name'] = ret['siteId']['name']
            ret['siteId'] = ret['siteId']['handler']['epaSiteId']
            ret['permissions'] = []
            for module in self.modules:
                permission = ret.pop(module)
                ret['permissions'].append(permission)
            return ret
        except KeyError as e:
            raise APIException(f'malformed JSON {e}')

    def to_internal_value(self, data):
        site_id = ''
        try:
            site_id = data.pop('siteId')
            data.pop('siteName')
            permissions = data.pop('permissions')
            site = Site.objects.get(epa_site__epa_id=site_id)
            for i in permissions:
                rcrainfo_module = i['module']
                data[rcrainfo_module] = i
            data['siteId'] = site
            return super().to_internal_value(data)
        except Site.DoesNotExist as e:
            raise APIException(f'Could not get site: {site_id}') from e
        except KeyError as e:
            raise APIException(f'malformed JSON: {e}')

    class Meta:
        model = SitePermission
        fields = [
            'siteId',
            'SiteManagement',
            'AnnualReport',
            'BiennialReport',
            'eManifest',
            'WIETS',
            'myRCRAid'
        ]
