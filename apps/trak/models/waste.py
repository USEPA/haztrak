from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from lib.rcrainfo import lookups as lu


class WasteLine(models.Model):
    dot_hazardous = models.BooleanField(
        verbose_name='DOT hazardous',
    )
    # DOT information (dot_id, dot_printed_info)
    dot_id = models.CharField(
        verbose_name='DOT ID number',
        max_length=12,
    )
    dot_printed_info = models.CharField(
        verbose_name='DOT printed information',
        max_length=500,
    )
    waste_description = models.CharField(
        null=True,
        blank=True,
        max_length=500,
    )
    container_count = models.PositiveIntegerField(
        verbose_name='Number of containers',
        validators=[MinValueValidator(0), MaxValueValidator(99999)],
    )
    container_type = models.CharField(
        max_length=2,
        choices=lu.CONTAINERS,
    )
    quantity = models.PositiveIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(99999)],
    )
    quantity_uom = models.CharField(
        verbose_name='Unit of Measurement',
        max_length=1,
        choices=lu.UOM,
    )
    br_info = models.JSONField(
        verbose_name='BR information',
        null=True,
        blank=True,
    )
    br_provided = models.BooleanField(
        verbose_name='BR info provided'
    )
    density = models.FloatField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(999.99)],
    )
    density_uom = models.CharField(
        verbose_name='Density units of Measurement',
        max_length=5,
        null=True,
        blank=True,
        choices=[('1', 'lbs/gal'),
                 ('2', 'sg')],
    )
    form_code = models.CharField(
        max_length=5,
        null=True,
        blank=True,
    )
    source_code = models.CharField(
        max_length=5,
        null=True,
        blank=True,
    )
    waste_minimization_code = models.CharField(
        verbose_name='Waste minimization code',
        max_length=5,
        null=True,
        blank=True,
    )
    hazardous_waste = models.JSONField()
    pcb = models.BooleanField(
        verbose_name='Contains PCBs?'
    )
    pcb_info = models.JSONField(
        verbose_name='PCB information',
        null=True,
        blank=True,
    )
    discrepancy_residue_info = models.JSONField(
        null=True,
        blank=True,
    )
    quantity_discrepancy = models.BooleanField(
        null=True,
        blank=True,
    )
    type_discrepancy = models.BooleanField(
        null=True,
        blank=True,
    )
    discrepancy_comments = models.CharField(
        max_length=255,
        null=True,
        blank=True,
    )
    residue = models.BooleanField(
        null=True,
        blank=True,
    )
    residue_comments = models.CharField(
        max_length=255,
        null=True,
        blank=True,
    )
    management_method = models.CharField(
        max_length=5,
        verbose_name='Management Method Code',
    )
    line_number = models.PositiveIntegerField(
        verbose_name='Waste line number',
    )
    epa_waste = models.BooleanField(
        verbose_name='Federal waste?',
    )

    def __str__(self):
        return f'{self.container_count} {self.container_type}(s) of blah'
