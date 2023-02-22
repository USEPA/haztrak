from django.db import models


class WasteLine(models.Model):
    """
    ToDo: Every place we have as a JSON field likely should be stored in separate table
    Model definition for hazardous waste listed on a uniform hazardous waste manifest.
    """

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
        verbose_name="Waste line number",
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
        verbose_name="Management method code",
        null=True,
        blank=True,
    )
    pcb = models.BooleanField(
        verbose_name="Contains PCBs",
    )
    pcb_infos = models.JSONField(
        verbose_name="PCB information",
        null=True,
        blank=True,
    )
    discrepancy_info = models.JSONField(
        verbose_name="Discrepancy-Residue information",
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
