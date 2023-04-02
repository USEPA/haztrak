from typing import Dict

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.sites.serializers import EpaSiteSerializer
from apps.trak.models import ManifestHandler, Transporter

from .signature_ser import ESignatureSerializer, PaperSignatureSerializer


class ManifestHandlerSerializer(EpaSiteSerializer):
    """Serializer for EpaSite on manifest"""

    epa_site = EpaSiteSerializer()
    electronicSignaturesInfo = ESignatureSerializer(
        source="e_signatures",
        many=True,
        required=False,
    )
    paperSignatureInfo = PaperSignatureSerializer(
        source="paper_signature",
        required=False,
    )
    signed = serializers.ReadOnlyField()

    def update(self, instance, validated_data: Dict):
        return self.Meta.model.objects.update(instance, **validated_data)

    def create(self, validated_data: Dict):
        return self.Meta.model.objects.save(**validated_data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        handler_rep = representation.pop("epa_site")
        for key in handler_rep:
            representation[key] = handler_rep[key]
        return representation

    def to_internal_value(self, data: Dict):
        instance = {}
        if "electronicSignaturesInfo" in data:
            instance["electronicSignaturesInfo"] = data.pop("electronicSignaturesInfo")
        if "paperSignatureInfo" in data:
            instance["paperSignatureInfo"] = data.pop("paperSignatureInfo")
        instance["epa_site"] = data
        if "order" in instance["epa_site"]:
            instance["order"] = instance["epa_site"]["order"]
        return super().to_internal_value(instance)

    class Meta:
        model = ManifestHandler
        fields = [
            "epa_site",
            "electronicSignaturesInfo",
            "paperSignatureInfo",
            "signed",
        ]


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
