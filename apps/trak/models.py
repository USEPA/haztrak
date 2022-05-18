from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from lib.rcrainfo import lookups as lu


class Handler(models.Model):
    epa_id = models.CharField(
        verbose_name='EPA Id number',
        max_length=25
    )
    name = models.CharField(
        max_length=200
    )
    modified = models.BooleanField(
        null=True,
        blank=True
    )
    registered = models.BooleanField(
        null=True,
        blank=True
    )
    contact = models.JSONField(
        verbose_name='Contact information')
    emergency_phone = models.JSONField(
        null=True,
        blank=True
    )
    electronic_signatures_info = models.JSONField(
        verbose_name='Electronic signature info',
        null=True,
        blank=True
    )
    gis_primary = models.BooleanField(
        verbose_name='GIS primary',
        null=True,
        blank=True,
        default=False
    )
    can_esign = models.BooleanField(
        verbose_name='Can electronically sign',
        null=True,
        blank=True
    )
    limited_esign = models.BooleanField(
        verbose_name='Limited electronic signing ability',
        null=True,
        blank=True
    )
    registered_emanifest_user = models.BooleanField(
        verbose_name='Has Registered e-Manifest user',
        null=True,
        blank=True,
        default=False
    )
    # Site Address related fields
    site_street_number = models.CharField(
        max_length=12,
        null=True,
        blank=True
    )
    site_address1: str = models.CharField(
        verbose_name='Site address 1',
        max_length=50
    )
    site_address2 = models.CharField(
        verbose_name='Site address 2',
        max_length=50,
        default=None,
        null=True,
        blank=True
    )
    site_city = models.CharField(
        null=True,
        blank=True,
        max_length=25
    )
    site_state = models.CharField(
        max_length=2,
        null=True,
        blank=True,
        choices=lu.STATES
    )
    site_country = models.CharField(
        max_length=2,
        null=True,
        blank=True,
        choices=lu.COUNTRIES
    )
    site_zip = models.CharField(
        null=True,
        blank=True,
        max_length=5
    )
    # Mailing address related fields
    mail_street_number = models.CharField(
        max_length=12,
        null=True,
        blank=True
    )
    mail_address1: str = models.CharField(
        verbose_name='Mailing address 1',
        max_length=50
    )
    mail_address2 = models.CharField(
        verbose_name='Mailing address 2',
        max_length=50,
        default=None,
        null=True,
        blank=True
    )
    mail_city = models.CharField(
        null=True,
        blank=True,
        max_length=25
    )
    mail_state = models.CharField(
        max_length=2,
        null=True,
        blank=True,
        choices=lu.STATES
    )
    mail_country = models.CharField(
        max_length=2,
        null=True,
        blank=True,
        choices=lu.COUNTRIES
    )
    mail_zip = models.CharField(
        null=True,
        blank=True,
        max_length=5
    )

    def __str__(self):
        return f'{self.epa_id}'


class WasteLine(models.Model):
    dot_hazardous = models.BooleanField(
        verbose_name='DOT hazardous'
    )
    # DOT information (dot_id, dot_printed_info)
    dot_id = models.CharField(
        verbose_name='DOT ID number',
        max_length=12
    )
    dot_printed_info = models.CharField(
        verbose_name='DOT printed information',
        max_length=500
    )
    waste_description = models.CharField(
        null=True,
        blank=True,
        max_length=500
    )
    container_count = models.PositiveIntegerField(
        verbose_name='Number of containers',
        validators=[MinValueValidator(0), MaxValueValidator(99999)]
    )
    container_type = models.CharField(
        max_length=2,
        choices=lu.CONTAINERS
    )
    quantity = models.PositiveIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(99999)]
    )
    quantity_uom = models.CharField(
        verbose_name='Unit of Measurement',
        max_length=1,
        choices=lu.UOM
    )
    br_info = models.JSONField()
    density = models.FloatField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(999.99)]
    )
    density_uom = models.CharField(
        verbose_name='Density units of Measurement',
        max_length=5,
        null=True,
        blank=True,
        choices=[('1', 'lbs/gal'),
                 ('2', 'sg')]
    )
    form_code = models.CharField(
        max_length=5,
        null=True,
        blank=True
    )
    source_code = models.CharField(
        max_length=5,
        null=True,
        blank=True
    )
    waste_minimization_code = models.CharField(
        verbose_name='Waste minimization code',
        max_length=5,
        null=True,
        blank=True
    )
    br_provided = models.BooleanField(
        verbose_name='BR info provided'
    )
    hazardous_waste = models.JSONField()
    pcb = models.BooleanField(
        verbose_name='Contains PCBs?'
    )
    pcb_info = models.JSONField(
        verbose_name='PCB information'
    )
    discrepancy_residue_info = models.JSONField()
    quantity_discrepancy = models.BooleanField(
        null=True,
        blank=True
    )
    type_discrepancy = models.BooleanField(
        null=True,
        blank=True
    )
    discrepancy_comments = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )
    residue = models.BooleanField(
        null=True,
        blank=True
    )
    residue_comments = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )
    management_method = models.CharField(
        max_length=5,
        verbose_name='Management Method Code'
    )
    line_number = models.PositiveIntegerField(
        verbose_name='Waste line number'
    )
    epa_waste = models.BooleanField(
        verbose_name='Federal waste?'
    )
    federal_waste = models.BooleanField()

    def __str__(self):
        return f'{self.container_count} {self.container_type}(s) of blah'


class Manifest(models.Model):
    created_date = models.DateTimeField(
        null=True,
        auto_now=True
    )
    update_date = models.DateTimeField(
        auto_now=True
    )
    mtn = models.CharField(
        verbose_name='Manifest Tracking Number',
        max_length=15
    )
    status = models.CharField(
        max_length=25,
        choices=lu.STATUS,
        default='notAssigned'
    )
    submission_type = models.CharField(
        max_length=25,
        choices=lu.SUB_TYPE,
        default='FullElectronic'
    )
    signature_status = models.BooleanField(
        null=True,
        blank=True
    )
    origin_type = models.CharField(
        max_length=25,
        choices=lu.ORIGIN_TYPE,
        default='Service'
    )
    shipped_date = models.DateTimeField(
        null=True,
        blank=True
    )
    potential_ship_date = models.DateTimeField(
        verbose_name='Potential ship date',
        null=True,
        blank=True
    )
    received_date = models.DateTimeField(
        null=True,
        blank=True
    )
    certified_date = models.DateTimeField(
        null=True,
        blank=True
    )
    certified_by = models.JSONField(
        null=True,
        blank=True
    )
    generator = models.ForeignKey(
        'Handler',
        on_delete=models.PROTECT,
        related_name='generator'
    )
    transporters = models.ManyToManyField(Handler)
    tsd = models.ForeignKey(
        'Handler',
        verbose_name='Designated facility',
        on_delete=models.PROTECT,
        related_name='designated_facility'
    )
    broker = models.JSONField(
        null=True, blank=True)
    wastes = models.JSONField()
    rejection = models.BooleanField(
        blank=True,
        default=False
    )
    rejection_info = models.JSONField(
        verbose_name='Rejection Information',
        null=True,
        blank=True)
    discrepancy = models.BooleanField(
        blank=True,
        default=False
    )
    residue = models.BooleanField(
        blank=True,
        default=False
    )
    residue_new_mtn = models.JSONField(
        verbose_name='Residue new MTN',
        blank=True,
        default=list
    )
    import_flag = models.BooleanField(
        verbose_name='Import',
        blank=True,
        default=False
    )
    import_info = models.JSONField(
        verbose_name='Import information',
        null=True,
        blank=True
    )
    contains_residue_or_rejection = models.BooleanField(
        verbose_name='Contains previous rejection or residue waste',
        null=True,
        blank=True
    )
    printed_document = models.JSONField(
        null=True,
        blank=True
    )
    form_document = models.JSONField(
        null=True,
        blank=True
    )
    additional_info = models.JSONField(
        null=True,
        blank=True
    )
    correction_info = models.JSONField(
        null=True,
        blank=True
    )
    ppc_status = models.JSONField(
        verbose_name='PPC info',
        null=True,
        blank=True
    )
    locked = models.BooleanField(
        null=True,
        blank=True
    )
    locked_reason = models.CharField(
        max_length=25,
        choices=lu.LOCKED_REASON,
        null=True,
        blank=True
    )
    transfer_requested = models.BooleanField(
        null=True,
        blank=True
    )
    transfer_status = models.CharField(
        max_length=200,
        null=True,
        blank=True
    )
    original_sub_type = models.CharField(
        verbose_name='Original Submission Type',
        max_length=25,
        choices=lu.SUB_TYPE,
        null=True
    )
    transfer_count = models.IntegerField(
        null=True,
        blank=True
    )
    next_transfer_time = models.DateTimeField(
        verbose_name='Next Transfer Time',
        null=True,
        blank=True
    )

    def __str__(self):
        return f'{self.mtn}'


class ElectronicSignature(models.Model):
    signer_first_name = models.CharField(
        verbose_name='First name',
        max_length=200)
    signer_last_name = models.CharField(
        verbose_name='Last name',
        max_length=200)
    signer_user_id = models.CharField(
        verbose_name='User ID',
        max_length=200)
    signature_date = models.DateTimeField(
        verbose_name='Signature_date')

    def __str__(self):
        return f'Signed {self.signature_date} by {self.signer_user_id}'


class Site(models.Model):
    name = models.CharField(
        verbose_name='Site Alias',
        max_length=200)
    epa_site = models.OneToOneField(
        verbose_name='Handler',
        to=Handler,
        on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.epa_site.epa_id}'
