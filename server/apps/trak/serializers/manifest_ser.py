import logging
from typing import Dict

from rest_framework import serializers

from apps.trak.models import Manifest
from apps.trak.serializers.handler_ser import ManifestHandlerSerializer

from ..models.manifest_models import AdditionalInfo
from .base_ser import TrakBaseSerializer
from .transporter_ser import TransporterSerializer
from .waste_line_ser import WasteLineSerializer

logger = logging.getLogger(__name__)


class AdditionalInfoSerializer(serializers.ModelSerializer):
    originalManifestTrackingNumbers = serializers.JSONField(
        allow_null=True,
        required=False,
        source="original_mtn",
    )
    newManifestDestination = serializers.CharField(
        allow_null=True,
        required=False,
        source="new_destination",
    )
    consentNumber = serializers.CharField(
        allow_null=True,
        required=False,
        source="consent_number",
    )
    comments = serializers.JSONField(
        allow_null=True,
        required=False,
    )
    handlingInstructions = serializers.CharField(
        allow_null=True,
        allow_blank=True,
        required=False,
        source="handling_instructions",
    )

    class Meta:
        model = AdditionalInfo
        fields = (
            "originalManifestTrackingNumbers",
            "newManifestDestination",
            "consentNumber",
            "comments",
            "handlingInstructions",
        )


class MtnSerializer(TrakBaseSerializer):
    """
    MtnSerializer shares select details on a user's manifests.
    """

    manifestTrackingNumber = serializers.CharField(
        source="mtn",
        required=False,
    )
    # status
    submissionType = serializers.CharField(
        source="submission_type",
        required=False,
    )
    signatureStatus = serializers.BooleanField(
        source="signature_status",
        allow_null=True,
        default=False,
    )

    class Meta:
        model = Manifest
        fields = [
            "manifestTrackingNumber",
            "status",
            "submissionType",
            "signatureStatus",
        ]


class ManifestSerializer(TrakBaseSerializer):
    """
    Manifest model serializer for JSON marshalling/unmarshalling
    """

    createdDate = serializers.DateTimeField(
        source="created_date",
        required=False,
    )
    updatedDate = serializers.DateTimeField(
        source="update_date",
        required=False,
    )
    manifestTrackingNumber = serializers.CharField(
        source="mtn",
        required=False,
    )
    # status
    submissionType = serializers.CharField(
        source="submission_type",
        required=False,
    )
    signatureStatus = serializers.BooleanField(
        source="signature_status",
        allow_null=True,
        default=False,
    )
    originType = serializers.CharField(
        source="origin_type",
        required=False,
    )
    shippedDate = serializers.DateTimeField(
        source="shipped_date",
        required=False,
    )
    potentialShipDate = serializers.CharField(
        source="potential_ship_date",
        required=False,
    )
    receivedDate = serializers.DateTimeField(
        source="received_date",
        required=False,
    )
    certifiedDate = serializers.DateTimeField(
        source="certified_date",
        required=False,
        allow_null=True,
    )
    certifiedBy = serializers.JSONField(
        source="certified_by",
        required=False,
        allow_null=True,
    )
    generator = ManifestHandlerSerializer()
    transporters = TransporterSerializer(many=True)
    designatedFacility = ManifestHandlerSerializer(
        source="tsd",
    )
    # broker
    wastes = WasteLineSerializer(many=True)
    # rejection
    rejectionInfo = serializers.JSONField(
        source="rejection_info",
        required=False,
        allow_null=True,
    )
    # discrepancy
    # residue
    residueNewManifestTrackingNumbers = serializers.JSONField(
        source="residue_new_mtn",
        required=False,
        default=[],
    )
    # import, see .to_representation() and .to_internal_value() methods
    importInfo = serializers.JSONField(
        source="import_info",
        required=False,
        allow_null=True,
    )
    containsPreviousRejectOrResidue = serializers.BooleanField(
        source="contains_residue_or_rejection",
        required=False,
        default=False,
    )
    printedDocument = serializers.JSONField(
        source="printed_document",
        required=False,
        allow_null=True,
    )
    formDocument = serializers.JSONField(
        source="form_document",
        required=False,
        allow_null=True,
    )
    additionalInfo = AdditionalInfoSerializer(
        source="additional_info",
        required=False,
        allow_null=True,
    )
    correctionInfo = serializers.JSONField(
        source="correction_info",
        required=False,
        allow_null=True,
    )
    ppcStatus = serializers.JSONField(
        source="ppc_status",
        required=False,
        allow_null=True,
    )
    # mtnValidationInfo
    # provideImageGeneratorInfo
    locked = serializers.BooleanField(
        required=False,
        allow_null=True,
        default=False,
    )

    lockReason = serializers.ChoiceField(
        choices=Manifest.LockReason.choices,
        source="get_lock_reason_display",
        required=False,
        allow_null=True,
    )

    def update(self, instance, validated_data: Dict) -> Manifest:
        return self.Meta.model.objects.save(**validated_data)

    def create(self, validated_data: Dict) -> Manifest:
        return self.Meta.model.objects.save(**validated_data)

    # https://www.django-rest-framework.org/api-guide/serializers/#overriding-serialization-and-deserialization-behavior
    def to_representation(self, instance) -> str:
        """
        Replace 'import_flag' with expected Python Keyword 'import' in JSON
        """
        data = super(ManifestSerializer, self).to_representation(instance)
        data["import"] = instance.import_flag
        return data

    def to_internal_value(self, data):
        """
        Replace 'import_flag' with expected Python Keyword 'import' in JSON
        """
        instance = super(ManifestSerializer, self).to_internal_value(data)
        try:
            instance.import_flag = data.get("import")
            return instance
        except KeyError:
            instance.import_flag = False
            return instance

    class Meta:
        model = Manifest
        fields = [
            "createdDate",
            "updatedDate",
            "manifestTrackingNumber",
            "status",
            "submissionType",
            "signatureStatus",
            "originType",
            "shippedDate",
            "potentialShipDate",
            "receivedDate",
            "certifiedDate",
            "certifiedBy",
            "generator",
            "transporters",
            "designatedFacility",
            "broker",
            "wastes",
            "rejection",
            "rejectionInfo",
            "discrepancy",
            "residue",
            "residueNewManifestTrackingNumbers",
            # 'import', field conflicts with keyword,  see to_representation method
            "importInfo",
            "containsPreviousRejectOrResidue",
            "printedDocument",
            "formDocument",
            "additionalInfo",
            "correctionInfo",
            "ppcStatus",
            "locked",
            "lockReason",
        ]
