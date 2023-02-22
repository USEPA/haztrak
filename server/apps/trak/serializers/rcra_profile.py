from rest_framework import serializers
from rest_framework.exceptions import APIException
from rest_framework.serializers import ModelSerializer

from apps.trak.models import RcraProfile, SitePermission
from apps.trak.serializers.trak import TrakBaseSerializer


class SitePermissionSerializer(TrakBaseSerializer):
    """
    SitePermission model serializer
    We use this internally because it's easier to handle, using consistent naming,
    Haztrak has a separate serializer for user permissions from RCRAInfo.
    See EpaPermissionSerializer.
    """

    rcrainfo_modules = [
        "siteManagement",
        "annualReport",
        "biennialReport",
        "eManifest",
        "WIETS",
        "myRCRAid",
    ]

    epaId = serializers.StringRelatedField(source="site")
    siteManagement = serializers.BooleanField(source="site_manager")
    annualReport = serializers.CharField(
        source="annual_report",
    )
    biennialReport = serializers.CharField(
        source="biennial_report",
    )
    eManifest = serializers.CharField(
        source="e_manifest",
    )
    WIETS = serializers.CharField(
        source="wiets",
    )
    myRCRAid = serializers.CharField(
        source="my_rcra_id",
    )

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["permissions"] = {}
        for module in self.rcrainfo_modules:
            ret["permissions"][module] = ret.pop(module)
        return ret

    class Meta:
        model = SitePermission
        fields = [
            "epaId",
            "siteManagement",
            "annualReport",
            "biennialReport",
            "eManifest",
            "WIETS",
            "myRCRAid",
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
            value = "Active"
        elif not value:
            value = "InActive"
        # RcraInfo gives us an array of object with module and level keys
        ret = {"module": f"{self.field_name}", "level": value}
        return ret

    def to_internal_value(self, data):
        """
        Convert the json object {"module" : string, "level": string}
        to Haztrak's internal representation
        """
        data = data["level"]
        if data == "Active":
            data = True
        elif data == "InActive":
            data = False
        return data


class EpaPermissionSerializer(SitePermissionSerializer):
    rcrainfo_modules = [
        "AnnualReport",
        "BiennialReport",
        "eManifest",
        "myRCRAid",
        "WIETS",
        "SiteManagement",
    ]
    """
    SitePermission model serializer specifically for reading a user's site permissions
    from RCRAInfo. It's not used for serializing, only deserializing permissions from RCRAinfo
    """
    siteId = serializers.StringRelatedField(
        source="site",
    )
    name = serializers.StringRelatedField(
        source="site.epa_site.name",
        required=False,
    )
    SiteManagement = EpaPermissionField(source="site_manager")
    AnnualReport = EpaPermissionField(
        source="annual_report",
    )
    BiennialReport = EpaPermissionField(
        source="biennial_report",
    )
    eManifest = EpaPermissionField(
        source="e_manifest",
    )
    WIETS = EpaPermissionField(
        source="wiets",
    )
    myRCRAid = EpaPermissionField(
        source="my_rcra_id",
    )

    def to_internal_value(self, data):
        """
        This method converts a user's site specific permissions provided by RcraInfo
        into Haztrak's internal representation. Namely, converting the permission per module
        into a key-object structure.
        """
        try:
            data.pop("siteName")
            permissions = data.pop("permissions")
            for i in permissions:
                rcrainfo_module = i["module"]
                data[rcrainfo_module] = i
            return super().to_internal_value(data)
        except KeyError as exc:
            raise APIException(f"malformed JSON: {exc}")

    class Meta:
        model = SitePermission
        # Note the Pascal case, instead of camel case for (some) Rcrainfo modules.
        fields = [
            "siteId",
            "name",
            "SiteManagement",
            "AnnualReport",
            "BiennialReport",
            "eManifest",
            "WIETS",
            "myRCRAid",
        ]


class ProfileGetSerializer(ModelSerializer):
    """
    Rcra Profile model serializer for JSON marshalling/unmarshalling
    """

    user = serializers.StringRelatedField()
    epaSites = SitePermissionSerializer(source="site_permission", required=False, many=True)
    phoneNumber = serializers.CharField(
        source="phone_number",
        required=False,
    )
    rcraAPIID = serializers.CharField(
        source="rcra_api_id",
        required=False,
    )
    rcraUsername = serializers.CharField(
        source="rcra_username",
        required=False,
    )

    class Meta:
        model = RcraProfile
        fields = [
            "user",
            "rcraAPIID",
            "rcraUsername",
            "epaSites",
            # 'sites',
            "phoneNumber",
        ]


class ProfileUpdateSerializer(ProfileGetSerializer):
    """
    Subclasses the ProfileGetSerializer and adds the users RCRAInfo API Key
    to be used for updating the user's RcraProfile (not for GET requests).
    """

    rcraAPIKey = serializers.CharField(
        source="rcra_api_key",
        required=False,
    )

    class Meta:
        model = RcraProfile
        fields = [
            "user",
            "rcraAPIID",
            "rcraAPIKey",
            "rcraUsername",
            "epaSites",
            "phoneNumber",
        ]
