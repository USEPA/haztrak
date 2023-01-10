from rest_framework import serializers
from rest_framework.exceptions import APIException
from rest_framework.serializers import ModelSerializer

from apps.trak.models import RcraProfile, Site, SitePermission
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
    Subclasses the ProfileGetSerializer and adds the users RCRAInfo API Key
    to be used for updating the user's RcraProfile (not for GET requests).
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
    SitePermission model serializer
    We use this internally because it's easier to handle, using consistent naming,
    Haztrak has a separate serializer for user permissions from RCRAInfo. See EpaPermissionSerializer.
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
            # convert boolean to 'Active' or 'Inactive' when talking to RcraInfo
            value = 'Active'
        elif not value:
            value = 'InActive'
        # RcraInfo gives us an array of object with module and level keys
        ret = {
            "module": f'{self.field_name}',
            "level": value
        }
        return ret

    def to_internal_value(self, data):
        """
        Convert the json object {"module" : string, "level": string}
        to Haztrak's internal representation
        """
        data = data['level']
        if data == 'Active':
            data = True
        elif data == 'InActive':
            data = False
        return data


class EpaPermissionSerializer(SitePermissionSerializer):
    rcrainfo_modules = ['AnnualReport', 'BiennialReport', 'eManifest', 'myRCRAid', 'WIETS', 'SiteManagement']
    """
    SitePermission model serializer specifically for reading a user's site permissions
    from RCRAInfo
    """
    siteId = serializers.StringRelatedField(
        source='site',
    )
    name = serializers.StringRelatedField(
        source='site.epa_site.name',
        required=False,
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
        """
        This method reproduces a user's site specific permissions in a JSON
        structure that mimics RcraInfo's (although we never post this info
        to RcraInfo).
        """
        try:
            ret = super().to_representation(instance)
            ret['permissions'] = []
            for module in self.rcrainfo_modules:
                permission = ret.pop(module)
                ret['permissions'].append(permission)
            return ret
        except KeyError as e:
            raise APIException(f'malformed JSON {e}')

    def to_internal_value(self, data):
        """
        This method converts a user's site specific permissions provided by RcraInfo
        into Haztrak's internal representation. Namely, converting the permission per module
        into a key-object structure.
        """
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
        # Note the Pascal case, instead of camel case for (some) Rcrainfo modules.
        fields = [
            'siteId',
            'name',
            'SiteManagement',
            'AnnualReport',
            'BiennialReport',
            'eManifest',
            'WIETS',
            'myRCRAid'
        ]
