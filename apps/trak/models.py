from django.db import models
from lib.rcrainfo import lookups as lu


class Manifest(models.Model):
    created_date = models.DateTimeField(
        null=True,
        auto_now=True)
    update_date = models.DateTimeField(
        auto_now=True)
    mtn = models.CharField(
        verbose_name='Manifest Tracking Number',
        max_length=15)
    status = models.CharField(
        max_length=25,
        choices=lu.STATUS,
        default='notAssigned')
    submission_type = models.CharField(
        max_length=25,
        choices=lu.SUB_TYPE,
        default='FullElectronic')
    signature_status = models.BooleanField(
        null=True,
        blank=True)
    origin_type = models.CharField(
        max_length=25,
        choices=lu.ORIGIN_TYPE,
        default='Service')
    shipped_date = models.DateTimeField(
        null=True,
        blank=True)
    potential_ship_date = models.DateTimeField(
        verbose_name='Potential ship date',
        null=True,
        blank=True)
    received_date = models.DateTimeField(
        null=True,
        blank=True)
    certified_date = models.DateTimeField(
        null=True,
        blank=True)
    certified_by = models.JSONField(
        null=True,
        blank=True)
    generator = models.ForeignKey(
        'Handler',
        on_delete=models.PROTECT,
        related_name='generator')
    transporters = models.JSONField()
    tsd = models.ForeignKey(
        'Handler',
        verbose_name='Designated facility',
        on_delete=models.PROTECT,
        related_name='designated_facility')
    broker = models.JSONField(
        null=True, blank=True)
    wastes = models.JSONField()
    rejection = models.BooleanField(
        null=True,
        blank=True,
        default=False)
    rejection_info = models.JSONField(
        verbose_name='Rejection Information',
        null=True,
        blank=True)
    discrepancy = models.BooleanField(
        default=False)
    residue = models.BooleanField(
        null=True,
        blank=True)
    residue_new_mtn = models.JSONField(
        verbose_name='Residue new MTN',
        null=True,
        blank=True)
    # TODO: The manifest field 'import' conflicts with the python keyword
    import_flag = models.BooleanField(
        verbose_name='Import',
        null=True,
        blank=True)
    import_info = models.JSONField(
        verbose_name='Import information',
        null=True,
        blank=True)
    contains_residue_or_rejection = models.BooleanField(
        verbose_name='Contains previous rejection or residue waste',
        null=True,
        blank=True)
    printed_document = models.JSONField(
        null=True,
        blank=True)
    form_document = models.JSONField(
        null=True,
        blank=True)
    additional_info = models.JSONField(
        null=True,
        blank=True)
    correction_info = models.JSONField(
        null=True,
        blank=True)
    ppc_status = models.JSONField(
        verbose_name='PPC info',
        null=True,
        blank=True)
    locked = models.BooleanField(
        null=True,
        blank=True)
    locked_reason = models.CharField(
        max_length=25,
        choices=lu.LOCKED_REASON,
        null=True,
        blank=True)
    # Not sure if these fields are needed
    transfer_requested = models.BooleanField(
        null=True,
        blank=True)
    transfer_status = models.CharField(
        max_length=200,
        null=True,
        blank=True)
    original_sub_type = models.CharField(
        verbose_name='Original Submission Type',
        max_length=25,
        choices=lu.SUB_TYPE,
        null=True)
    transfer_count = models.IntegerField(
        null=True,
        blank=True)
    next_transfer_time = models.DateTimeField(
        verbose_name='Next Transfer Time',
        null=True,
        blank=True)

    def __str__(self):
        return f'{self.mtn}'


class Handler(models.Model):
    epa_id = models.CharField(
        verbose_name='EPA Id number',
        max_length=25)
    name = models.CharField(
        max_length=200)
    modified = models.BooleanField(
        null=True,
        blank=True)
    registered = models.BooleanField(
        null=True,
        blank=True)
    # TODO convert Addresses foreign key, will also likely require implementing a
    #  custom .create() and .update() method for the Handler serializer, and a new AddressSerializer
    # mailing_address = models.ForeignKey('Address', related_name='mailing_address', on_delete=models.CASCADE)
    # site_address = models.ForeignKey('Address', related_name='site_address', on_delete=models.CASCADE)
    mailing_address = models.JSONField()
    site_address = models.JSONField()
    contact = models.JSONField(
        verbose_name='Contact information')
    emergency_phone = models.JSONField(
        null=True,
        blank=True)
    electronic_signatures_info = models.JSONField(
        verbose_name='Electronic signature info',
        null=True,
        blank=True)
    gis_primary = models.BooleanField(
        verbose_name='GIS primary',
        null=True,
        blank=True,
        default=False)
    can_esign = models.BooleanField(
        verbose_name='Can electronically sign',
        null=True,
        blank=True)
    limited_esign = models.BooleanField(
        verbose_name='Limited electronic signing ability',
        null=True,
        blank=True)
    registered_emanifest_user = models.BooleanField(
        verbose_name='Has Registered e-Manifest user',
        null=True,
        blank=True,
        default=False)

    def __str__(self):
        return f'{self.epa_id}'


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


class Address(models.Model):
    street_number = models.IntegerField(
        null=True,
        blank=True)
    address1: str = models.CharField(
        verbose_name='Address 1',
        max_length=200)
    address2 = models.CharField(
        verbose_name='Address 2',
        max_length=200,
        default=None,
        null=True,
        blank=True)
    city = models.CharField(
        max_length=200)
    zip_code = models.CharField(
        verbose_name='Zip',
        max_length=32)
    state_name = models.CharField(
        verbose_name='State',
        max_length=32,
        choices=lu.STATES)

    def __str__(self):
        return f'{self.street_number} {self.address1}, ' \
               f'{self.city} {self.state_name} {self.zip_code}'
