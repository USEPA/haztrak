from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from apps.trak.models import RcraProfile
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
    """
    site = serializers.CharField()
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
        model = RcraProfile
        fields = [
            'site',
            'siteManagement',
            'annualReport',
            'biennialReport',
            'eManifest',
            'WIETS',
            'myRCRAid'
        ]
