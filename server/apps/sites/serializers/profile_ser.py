from rest_framework import serializers
from rest_framework.exceptions import APIException

from apps.sites.models import RcraSitePermission, SitePermissions

from .base_ser import SitesBaseSerializer
from .site_ser import SiteSerializer


class SitePermissionSerializer(SitesBaseSerializer):
    class Meta:
        model = SitePermissions
        fields = [
            "epaSiteId",
            "eManifest",
        ]

    epaSiteId = serializers.StringRelatedField(
        source="site",
    )
    eManifest = serializers.CharField(
        source="emanifest",
    )


class RcraSitePermissionSerializer(SitesBaseSerializer):
    """
    RcraSitePermission model serializer
    We use this internally because it's easier to handle, using consistent naming,
    Haztrak has a separate serializer for user permissions from RCRAInfo.
    See RcraPermissionSerializer.
    """

    rcrainfo_modules = [
        "siteManagement",
        "annualReport",
        "biennialReport",
        "eManifest",
        "WIETS",
        "myRCRAid",
    ]

    site = SiteSerializer(
        read_only=True,
    )
    siteManagement = serializers.BooleanField(
        source="site_manager",
    )
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
        representation = super().to_representation(instance)
        representation["permissions"] = {}
        for module in self.rcrainfo_modules:
            representation["permissions"][module] = representation.pop(module)
        return representation

    class Meta:
        model = RcraSitePermission
        fields = [
            "site",
            "siteManagement",
            "annualReport",
            "biennialReport",
            "eManifest",
            "WIETS",
            "myRCRAid",
        ]


class RcraPermissionField(serializers.Field):
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


class RcraPermissionSerializer(RcraSitePermissionSerializer):
    rcrainfo_modules = [
        "AnnualReport",
        "BiennialReport",
        "eManifest",
        "myRCRAid",
        "WIETS",
        "SiteManagement",
    ]
    """
    RcraSitePermission model serializer specifically for reading a user's site permissions
    from RCRAInfo. It's not used for serializing, only deserializing permissions from RCRAinfo
    """
    siteId = serializers.StringRelatedField(
        source="site",
    )
    name = serializers.StringRelatedField(
        source="site.rcra_site.name",
        required=False,
    )
    SiteManagement = RcraPermissionField(source="site_manager")
    AnnualReport = RcraPermissionField(
        source="annual_report",
    )
    BiennialReport = RcraPermissionField(
        source="biennial_report",
    )
    eManifest = RcraPermissionField(
        source="e_manifest",
    )
    WIETS = RcraPermissionField(
        source="wiets",
    )
    myRCRAid = RcraPermissionField(
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
        model = RcraSitePermission
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
