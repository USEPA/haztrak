from rest_framework import serializers

from apps.trak.models import WasteLine


class WasteLineSerializer(serializers.ModelSerializer):
    dotHazardous = serializers.BooleanField(
        source='dot_hazardous'
    )

    class Meta:
        model = WasteLine
        fields = 'dotHazardous'

    def __str__(self):
        return f'{self.dotHazardous} yo!'
