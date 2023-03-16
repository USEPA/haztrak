from django.db import models

from apps.trak.models.base_model import TrakBaseManager, TrakBaseModel


class WasteLineManager(TrakBaseManager):
    """
    Inter-model related functionality for Contact Model
    """

    def save(self, **waste_data) -> models.QuerySet:
        return super().save(**waste_data)


class WasteLine(TrakBaseModel):
    """
    ToDo: Every place we have as a JSON field likely should be stored in separate table
    Model definition for hazardous waste listed on a uniform hazardous waste manifest.
    """

    objects = WasteLineManager()

    manifest = models.ForeignKey(
        "Manifest",
        related_name="wastes",
        on_delete=models.CASCADE,
    )
    dot_hazardous = models.BooleanField(
        verbose_name="DOT hazardous",
    )
    dot_info = models.JSONField(
        verbose_name="DOT information",
        null=True,
        blank=True,
    )
    quantity = models.JSONField(
        null=True,
        blank=True,
    )
    hazardous_waste = models.JSONField(
        null=True,
        blank=True,
    )
    line_number = models.PositiveIntegerField(
        verbose_name="waste line number",
    )
    br = models.BooleanField(
        verbose_name="BR info provided",
    )
    br_info = models.JSONField(
        verbose_name="BR information",
        null=True,
        blank=True,
    )
    management_method = models.JSONField(
        verbose_name="management method code",
        null=True,
        blank=True,
    )
    pcb = models.BooleanField(
        verbose_name="contains PCBs",
    )
    pcb_infos = models.JSONField(
        verbose_name="PCB information",
        null=True,
        blank=True,
    )
    discrepancy_info = models.JSONField(
        verbose_name="discrepancy-residue information",
        null=True,
        blank=True,
    )
    epa_waste = models.BooleanField(
        verbose_name="EPA waste",
    )
    additional_info = models.JSONField(
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.manifest} line {self.line_number}"
