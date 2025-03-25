"""Profile serializer."""

from profile.models import Profile, RcrainfoProfile, RcrainfoSiteAccess

from core.serializers import TrakUserSerializer
from manifest.serializers.mixins import RemoveEmptyFieldsMixin
from rest_framework import serializers
from rest_framework.exceptions import ValidationError


class RcraSitePermissionSerializer(RemoveEmptyFieldsMixin, serializers.ModelSerializer):
    """RcrainfoSiteAccess model serializer.

    We use this internally because it's easier to handle,
    Using consistent naming,Haztrak has a separate serializer for user permissions from RCRAInfo.
    """

    rcrainfo_modules = [
        "siteManagement",
        "annualReport",
        "biennialReport",
        "eManifest",
        "WIETS",
        "myRCRAid",
    ]

    epaSiteId = serializers.CharField(
        read_only=True,
        source="site",
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
        """To JSON."""
        representation = super().to_representation(instance)
        representation["permissions"] = {}
        for module in self.rcrainfo_modules:
            representation["permissions"][module] = representation.pop(module)
        return representation

    class Meta:
        """Metaclass."""

        model = RcrainfoSiteAccess
        fields = [
            "epaSiteId",
            "siteManagement",
            "annualReport",
            "biennialReport",
            "eManifest",
            "WIETS",
            "myRCRAid",
        ]


class RcraPermissionField(serializers.Field):
    """Serializer for communicating with RCRAInfo, translates internal to RCRAInfo field names."""

    def to_representation(self, value):
        """Convert to JSON."""
        value = "Active" if value else "InActive"
        # RcraInfo gives us an array of object with module and level keys
        return {"module": f"{self.field_name}", "level": value}

    def to_internal_value(self, data):
        """Convert to Python."""
        try:
            passed_value = data["level"]
            # if 'Active' or 'InActive' is passed, convert it to True or False
            return {"Active": True, "InActive": False}.get(passed_value, passed_value)
        except KeyError as exc:
            msg = f"malformed JSON: {exc}"
            raise ValidationError(msg) from exc


class RcrainfoSitePermissionsSerializer(RcraSitePermissionSerializer):
    """RcraSitePermissions model serializer.

    Specifically for reading a user's site permissions.from RCRAInfo.
    It's not used for serializing, only deserializing permissions from RCRAinfo.
    """

    rcrainfo_modules = [
        "AnnualReport",
        "BiennialReport",
        "eManifest",
        "myRCRAid",
        "WIETS",
        "SiteManagement",
    ]
    siteId = serializers.CharField(
        source="site",
    )
    SiteManagement = RcraPermissionField(
        source="site_manager",
    )
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
        """Converts a RCRAInfo permissions into Haztrak's internal representation."""
        try:
            data.pop("siteName")
            permissions = data.pop("permissions")
            for i in permissions:
                rcrainfo_module = i["module"]
                data[rcrainfo_module] = i
            return super().to_internal_value(data)
        except KeyError as exc:
            msg = f"malformed JSON: {exc}"
            raise ValidationError(msg) from exc

    class Meta:
        """Metaclass."""

        model = RcrainfoSiteAccess
        fields = [
            "siteId",
            "SiteManagement",
            "AnnualReport",
            "BiennialReport",
            "eManifest",
            "WIETS",
            "myRCRAid",
        ]


class ProfileSerializer(serializers.ModelSerializer):
    """Serializer for a user's profile."""

    user = TrakUserSerializer(read_only=True)

    class Meta:
        """Metaclass."""

        model = Profile
        fields = [
            "user",
            "avatar",
        ]


class RcrainfoProfileSerializer(serializers.ModelSerializer):
    """Model serializer for marshalling/unmarshalling a user's RcrainfoProfile."""

    user = serializers.StringRelatedField(
        source="haztrak_profile",
    )
    rcraSites = RcraSitePermissionSerializer(
        source="permissions",
        required=False,
        many=True,
    )
    phoneNumber = serializers.CharField(
        source="phone_number",
        required=False,
    )
    rcraAPIID = serializers.CharField(
        source="rcra_api_id",
        required=False,
        allow_null=True,
        allow_blank=True,
    )
    rcraAPIKey = serializers.CharField(
        source="rcra_api_key",
        required=False,
        write_only=True,
        allow_blank=True,
        allow_null=True,
    )
    rcraUsername = serializers.CharField(
        source="rcra_username",
        required=False,
    )
    apiUser = serializers.BooleanField(
        source="has_rcrainfo_api_id_key",
        required=False,
        allow_null=False,
    )

    class Meta:
        """Metaclass."""

        model = RcrainfoProfile
        fields = [
            "user",
            "rcraAPIID",
            "rcraAPIKey",
            "rcraUsername",
            "rcraSites",
            "phoneNumber",
            "apiUser",
        ]
