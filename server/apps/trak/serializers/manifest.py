from rest_framework import serializers

from apps.trak.models import Manifest, Transporter, WasteLine
from apps.trak.serializers.handler import HandlerSerializer
from apps.trak.serializers.trak import TrakBaseSerializer

from .transporter import TransporterSerializer
from .waste_line import WasteLineSerializer


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
        default=None,
    )
    certifiedBy = serializers.JSONField(
        source="certified_by",
        required=False,
        allow_null=True,
        default=None,
    )
    generator = HandlerSerializer()
    transporters = TransporterSerializer(many=True)
    designatedFacility = HandlerSerializer(
        source="tsd",
    )
    # broker
    wastes = WasteLineSerializer(many=True)
    # rejection
    rejectionInfo = serializers.JSONField(
        source="rejection_info",
        required=False,
        allow_null=True,
        default=None,
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
        default=None,
    )
    containsPreviousRejectOrResidue = serializers.BooleanField(
        source="contains_residue_or_rejection", required=False, default=False
    )
    printedDocument = serializers.JSONField(
        source="printed_document",
        required=False,
        allow_null=True,
        default=None,
    )
    formDocument = serializers.JSONField(
        source="form_document",
        required=False,
        allow_null=True,
        default=None,
    )
    additionalInfo = serializers.JSONField(
        source="additional_info",
        required=False,
        allow_null=True,
        default=None,
    )
    correctionInfo = serializers.JSONField(
        source="correction_info",
        required=False,
        allow_null=True,
        default=None,
    )
    ppcStatus = serializers.JSONField(
        source="ppc_status",
        required=False,
        allow_null=True,
        default=None,
    )
    # mtnValidationInfo
    # provideImageGeneratorInfo
    locked = serializers.BooleanField(
        required=False,
        allow_null=True,
        default=False,
    )

    lockedReason = serializers.CharField(
        source="locked_reason",
        required=False,
        allow_null=True,
        default=None,
    )

    def create(self, validated_data) -> Manifest:
        waste_data = validated_data.pop("wastes")
        trans_data = validated_data.pop("transporters")
        manifest = Manifest.objects.create_manifest(validated_data)
        for waste_line in waste_data:
            WasteLine.objects.create(manifest=manifest, **waste_line)
        for transporter in trans_data:
            transporter["manifest"] = manifest
            Transporter.objects.create_transporter(**transporter)
        return manifest

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
            "lockedReason",
        ]
