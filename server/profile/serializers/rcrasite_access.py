from profile.models import RcrainfoSiteAccess

from rest_framework import serializers
from rest_framework.exceptions import ValidationError


class RcraSiteBaseSerializer(serializers.ModelSerializer):
    def __str__(self):
        return f"{self.__class__.__name__}"

    def __repr__(self):
        return f"<{self.__class__.__name__}({self.data})>"

    def to_representation(self, instance):
        """
        Remove empty fields when serializing
        """
        data = super().to_representation(instance)
        for field in self.fields:
            try:
                if data[field] is None:
                    data.pop(field)
            except KeyError:
                pass
        return data


class RcraSitePermissionSerializer(RcraSiteBaseSerializer):
    """
    We use this internally because it's easier to handle, using consistent naming,
    Haztrak has a separate serializer for user permissions from RCRAInfo.
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
        representation = super().to_representation(instance)
        representation["permissions"] = {}
        for module in self.rcrainfo_modules:
            representation["permissions"][module] = representation.pop(module)
        return representation

    class Meta:
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
        value = "Active" if value else "InActive"
        # RcraInfo gives us an array of object with module and level keys
        return {"module": f"{self.field_name}", "level": value}

    def to_internal_value(self, data):
        try:
            passed_value = data["level"]
            # if 'Active' or 'InActive' is passed, convert it to True or False
            return {"Active": True, "InActive": False}.get(passed_value, passed_value)
        except KeyError as exc:
            raise ValidationError(f"malformed JSON: {exc}")


class RcrainfoSitePermissionsSerializer(RcraSitePermissionSerializer):
    """
    RcraSitePermissions model serializer specifically for reading a user's site permissions
    from RCRAInfo. It's not used for serializing, only deserializing permissions from RCRAinfo
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
        """This converts a RCRAInfo permissions into Haztrak's internal representation."""
        try:
            data.pop("siteName")
            permissions = data.pop("permissions")
            for i in permissions:
                rcrainfo_module = i["module"]
                data[rcrainfo_module] = i
            return super().to_internal_value(data)
        except KeyError as exc:
            raise ValidationError(f"malformed JSON: {exc}")

    class Meta:
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
