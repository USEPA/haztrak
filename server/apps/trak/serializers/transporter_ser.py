from rest_framework.exceptions import ValidationError

from apps.trak.models import Transporter
from apps.trak.serializers.handler_ser import ManifestHandlerSerializer


class TransporterSerializer(ManifestHandlerSerializer):
    """
    Transporter model serializer for JSON marshalling/unmarshalling
    """

    class Meta:
        model = Transporter
        fields = [
            "epa_site",
            "order",
            "paperSignatureInfo",
            "electronicSignaturesInfo",
            "signed",
        ]

    def to_internal_value(self, data):
        """Move fields related to epa_site to an internal epa_site dictionary."""
        try:
            internal = super().to_internal_value(data)
            return internal
        except ValidationError as exc:
            raise exc
