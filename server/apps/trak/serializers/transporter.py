from apps.trak.models import Transporter
from apps.trak.serializers.handler import HandlerSerializer
from apps.trak.serializers.trak import TrakBaseSerializer


class TransporterSerializer(TrakBaseSerializer):
    """
    Transporter model serializer for JSON marshalling/unmarshalling
    """

    handler = HandlerSerializer()

    class Meta:
        model = Transporter
        fields = [
            "handler",
            "order",
        ]

    def to_representation(self, obj):
        """flatten handler foreign key to transporter representation."""
        representation = super().to_representation(obj)
        profile_representation = representation.pop("handler")
        for key in profile_representation:
            representation[key] = profile_representation[key]
        return representation

    def to_internal_value(self, data):
        """Move fields related to handler to an internal handler dictionary."""
        handler_internal = {}
        for key in HandlerSerializer.Meta.fields:
            if key in data:
                handler_internal[key] = data.pop(key)
        data["handler"] = handler_internal
        internal = super().to_internal_value(data)
        return internal
