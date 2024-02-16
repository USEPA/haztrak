import logging
from typing import Dict

from rest_framework import serializers

from apps.handler.serializers import (
    ESignatureSerializer,
    HandlerSerializer,
    TransporterSerializer,
)
from apps.manifest.models import (
    AdditionalInfo,
    CorrectionInfo,
    ImportInfo,
    Manifest,
    PortOfEntry,
    draft_mtn,
)
from apps.rcrasite.models import RcraStates, Role
from apps.wasteline.serializers import (
    WasteLineSerializer,
)

logger = logging.getLogger(__name__)


class TrakBaseSerializer(serializers.ModelSerializer):
    """
    The Django Trak app base serializers class used to share functionality
    across trak app serializers universally.
    """

    def __str__(self):
        return f"{self.__class__.__name__}"

    def __repr__(self):
        return f"<{self.__class__.__name__}({self.data})>"

    def to_representation(self, instance):
        """
        Remove empty fields when serializing
        """
        data = super().to_representation(instance)
        for field in self.fields:
            try:
                if data[field] is None:
                    data.pop(field)
            except KeyError:
                pass
        return data


class AdditionalInfoSerializer(TrakBaseSerializer):
    originalManifestTrackingNumbers = serializers.JSONField(
        allow_null=True,
        required=False,
        source="original_mtn",
    )
    newManifestDestination = serializers.CharField(
        allow_null=True,
        required=False,
        allow_blank=True,
        source="new_destination",
    )
    consentNumber = serializers.CharField(
        allow_null=True,
        required=False,
        allow_blank=True,
        source="consent_number",
    )
    comments = serializers.JSONField(
        allow_null=False,
        required=False,
    )
    handlingInstructions = serializers.CharField(
        allow_null=False,
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
        allow_blank=True,
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
    generator = HandlerSerializer()
    transporters = TransporterSerializer(many=True)
    designatedFacility = HandlerSerializer(
        source="tsdf",
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
    )

    lockReason = serializers.ChoiceField(
        choices=Manifest.LockReason.choices,
        source="get_lock_reason_display",
        required=False,
        allow_null=True,
    )

    def update(self, instance: Manifest, validated_data: Dict) -> Manifest:
        return self.Meta.model.objects.save(instance, **validated_data)

    def create(self, validated_data: Dict) -> Manifest:
        return self.Meta.model.objects.save(None, **validated_data)

    def validate(self, data):
        if data["mtn"] == "" and data["status"] == "NotAssigned":
            data["mtn"] = draft_mtn()
        return super().validate(data)

    # https://www.django-rest-framework.org/api-guide/serializers/#overriding-serialization-and-deserialization-behavior
    def to_representation(self, instance) -> str:
        """
        Replace 'import_flag' with expected Python Keyword 'import' in JSON
        """
        data = super().to_representation(instance)
        data["import"] = instance.import_flag
        return data

    def to_internal_value(self, data):
        """
        Replace 'import_flag' with expected Python Keyword 'import' in JSON
        """
        instance = super().to_internal_value(data)
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


class PortOfEntrySerializer(TrakBaseSerializer):
    """
    Serializer for Port Of Entry
    """

    state = serializers.ChoiceField(
        choices=RcraStates.choices,
        required=False,
        allow_null=True,
    )

    cityPort = serializers.CharField(
        source="city_port",
        required=False,
        allow_null=True,
    )

    class Meta:
        model = PortOfEntry
        fields = ["state", "cityPort"]


class ImportInfoSerializer(TrakBaseSerializer):
    """
    Serializer for import information
    """

    importGenerator = serializers.JSONField(
        source="import_generator",
        allow_null=True,
        required=False,
    )
    portOfEntry = PortOfEntrySerializer(
        source="port_of_entry",
        required=False,
        allow_null=True,
    )

    class Meta:
        model = ImportInfo
        fields = ["importGenerator", "PortOfEntry"]


class CorrectionInfoSerializer(TrakBaseSerializer):
    """
    Serializer for Correction Info
    """

    versionNumber = serializers.CharField(
        source="version_number",
        required=False,
        allow_null=True,
    )
    active = serializers.BooleanField(
        required=False,
        allow_null=True,
        default=False,
    )
    ppcActive = serializers.BooleanField(
        source="ppc_active",
        required=False,
        allow_null=True,
        default=False,
    )
    electronicSignatureInfo = ESignatureSerializer(
        source="electronic_signature_info",
        required=False,
        allow_null=True,
    )
    epaSiteId = serializers.CharField(
        source="epa_site_id",
        required=False,
        allow_null=True,
    )
    initiatorRole = serializers.ChoiceField(
        source="initiator_role",
        choices=Role.choices,
        required=False,
        allow_null=True,
    )
    updateRole = serializers.ChoiceField(
        source="update_role",
        choices=Role.choices,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = CorrectionInfo
        fields = [
            "versionNumber",
            "active",
            "ppcActive",
            "electronicSignatureInfo",
            "epaSiteId",
            "initiatorRole",
            "updateRole",
        ]
