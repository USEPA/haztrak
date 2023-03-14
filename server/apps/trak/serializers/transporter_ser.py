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
            "handler",
            "order",
            "paperSignatureInfo",
            "electronicSignaturesInfo",
        ]

    def to_internal_value(self, data):
        """Move fields related to handler to an internal handler dictionary."""
        try:
            internal = super().to_internal_value(data)
            return internal
        except ValidationError as exc:
            raise exc
