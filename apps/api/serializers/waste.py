from rest_framework import serializers

from apps.trak.models import WasteLine


class WasteLineSerializer(serializers.ModelSerializer):
    lineNumber = serializers.IntegerField(
        source='line_number',
    )
    dotHazardous = serializers.BooleanField(
        source='dot_hazardous',
    )
    dotInformation = serializers.JSONField(
        source='dot_info',
        required=False,
    )
    quantity = serializers.JSONField(
        required=False,
    )
    hazardousWaste = serializers.JSONField(
        source='hazardous_waste',
        required=False,
    )
    # br
    brInfo = serializers.JSONField(
        source='br_info',
        required=False,
    )
    managementMethod = serializers.JSONField(
        source='management_method',
        required=False,
    )
    # pcb
    pcbInfos = serializers.JSONField(
        source='pcb_infos',
        required=False,
    )
    discrepancyResidueInfo = serializers.JSONField(
        source='discrepancy_info',
        required=False,
    )
    epaWaste = serializers.BooleanField(
        source='epa_waste',
    )

    class Meta:
        model = WasteLine
        fields = [
            'lineNumber',
            'dotHazardous',
            'dotInformation',
            'quantity',
            'hazardousWaste',
            'br',
            'brInfo',
            'managementMethod',
            'pcb',
            'pcbInfos',
            'discrepancyResidueInfo',
            'epaWaste',

        ]

    def to_representation(self, instance) -> str:
        data = super(WasteLineSerializer, self).to_representation(instance)
        for field in self.fields:
            try:
                if data[field] is None:
                    data.pop(field)
            except KeyError:
                pass
        return data

    def __str__(self):
        return f'{self.lineNumber}'
