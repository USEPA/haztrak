from rest_framework import serializers

from apps.trak.models import DotLookup, WasteCode, WasteLine

from .base_serializer import TrakBaseSerializer


class WasteLineSerializer(TrakBaseSerializer):
    """
    Waste Line model serializer for JSON marshalling/unmarshalling
    """

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
        model = WasteLine
        fields = [
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
        return f"{self.data}"


class WasteCodeSerializer(serializers.ModelSerializer):
    """Serializer for Federal and State waste codes"""

    class Meta:
        model = WasteCode
        fields = [
            "code",
            "description",
        ]


class DotOptionSerializer(serializers.ModelSerializer):
    """Serializer for DOT options"""

    class Meta:
        model = DotLookup
        fields = ["value"]
