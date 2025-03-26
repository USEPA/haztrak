"""Serializers for the WasteLine model."""

from typing import ClassVar

from rest_framework import serializers
from wasteline.models import DotLookup, WasteCode, WasteLine


class WasteBaseSerializer(serializers.ModelSerializer):
    """Base WasteLine model serializer for interfacing with RCRAInfo."""

    def __str__(self):
        """Human-readable representation of the WasteBaseSerializer."""
        return f"{self.__class__.__name__}"

    def __repr__(self):
        """Machine representation of the WasteBaseSerializer."""
        return f"<{self.__class__.__name__}({self.data})>"

    def to_representation(self, instance):
        """Remove empty fields when serializing."""
        data = super().to_representation(instance)
        for field in self.fields:
            try:
                if data[field] is None:
                    data.pop(field)
            except KeyError:
                pass
        return data


class WasteLineSerializer(WasteBaseSerializer):
    """Waste Line model serializer for interfacing with RCRAInfo."""

    lineNumber = serializers.IntegerField(
        source="line_number",
    )
    dotHazardous = serializers.BooleanField(
        source="dot_hazardous",
    )
    dotInformation = serializers.JSONField(
        source="dot_info",
        required=False,
    )
    quantity = serializers.JSONField(
        required=False,
    )
    hazardousWaste = serializers.JSONField(
        source="hazardous_waste",
        required=False,
    )
    # br
    brInfo = serializers.JSONField(
        source="br_info",
        required=False,
    )
    managementMethod = serializers.JSONField(
        source="management_method",
        required=False,
    )
    # pcb
    pcbInfos = serializers.JSONField(
        source="pcb_infos",
        required=False,
    )
    discrepancyResidueInfo = serializers.JSONField(
        source="discrepancy_info",
        required=False,
    )
    epaWaste = serializers.BooleanField(
        source="epa_waste",
    )

    class Meta:
        """Metaclass."""

        model = WasteLine
        fields: ClassVar = [
            "lineNumber",
            "dotHazardous",
            "dotInformation",
            "quantity",
            "hazardousWaste",
            "br",
            "brInfo",
            "managementMethod",
            "pcb",
            "pcbInfos",
            "discrepancyResidueInfo",
            "epaWaste",
        ]

    def __str__(self):
        """Human-readable representation of the WasteLine."""
        return f"{self.data}"


class WasteCodeSerializer(serializers.ModelSerializer):
    """Serializer for Federal and State waste codes."""

    class Meta:
        """Metaclass."""

        model = WasteCode
        fields: ClassVar = ["code", "description"]


class DotOptionSerializer(serializers.ModelSerializer):
    """Serializer for DOT options."""

    class Meta:
        """Metaclass."""

        model = DotLookup
        fields: ClassVar = ["value"]
