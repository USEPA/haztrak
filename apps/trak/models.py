from django.db import models

from lib.rcrainfo import lookups as lu


class Manifest(models.Model):
    created_date = models.DateTimeField(verbose_name='Created Date',
                                        null=True,
                                        auto_now=True)
    update_date = models.DateTimeField(auto_now=True)
    mtn = models.CharField(verbose_name='Manifest Tracking Number',
                           max_length=15)
    status = models.CharField(verbose_name='Status',
                              max_length=25,
                              choices=lu.STATUS,
                              default='notAssigned')
    submission_type = models.CharField(verbose_name='Submission Type',
                                       max_length=25,
                                       choices=lu.SUB_TYPE,
                                       default='FullElectronic')
    signature_status = models.BooleanField(verbose_name='Signature status',
                                           null=True,
                                           blank=True)
    origin_type = models.CharField(verbose_name='Origin Type',
                                   max_length=25,
                                   choices=lu.ORIGIN_TYPE,
                                   default='Service')
    shipped_date = models.DateTimeField(verbose_name='Shipped date',
                                        null=True,
                                        blank=True)
    potential_ship_date = models.DateTimeField('Potential ship date',
                                               null=True,
                                               blank=True)
    received_date = models.DateTimeField(verbose_name='Received date',
                                         null=True,
                                         blank=True)
    certified_date = models.DateTimeField(verbose_name='Certified date',
                                          null=True,
                                          blank=True)
    certified_by = models.JSONField(verbose_name='Certified By',
                                    null=True,
                                    blank=True)
    generator = models.ForeignKey('Handler',
                                  verbose_name='Generator',
                                  on_delete=models.PROTECT,
                                  related_name='generator')
    transporters = models.JSONField(verbose_name='Transporters')
    tsd = models.ForeignKey('Handler',
                            verbose_name='Designated facility',
                            on_delete=models.PROTECT,
                            related_name='designated_facility')
    broker = models.JSONField(null=True, blank=True)
    wastes = models.JSONField()
    rejection = models.BooleanField(verbose_name='Rejection',
                                    null=True,
                                    blank=True,
                                    default=False)
    rejection_info = models.JSONField(verbose_name='Rejection Information',
                                      null=True,
                                      blank=True)
    discrepancy = models.BooleanField(verbose_name='Discrepancy',
                                      default=False)
    residue = models.BooleanField(verbose_name='Residue',
                                  null=True,
                                  blank=True)
    residue_new_mtn = models.JSONField(verbose_name='Residue new MTN',
                                       null=True,
                                       blank=True)
    # TODO: The manifest field 'import' conflicts with the python keyword
    import_flag = models.BooleanField(verbose_name='Import',
                                      null=True,
                                      blank=True)
    import_info = models.JSONField(verbose_name='Import Information',
                                   null=True,
                                   blank=True)
    contains_residue_or_rejection = models.BooleanField(verbose_name='Contains previous rejection or residue',
                                                        null=True,
                                                        blank=True)
    printed_document = models.JSONField(verbose_name='Printed document',
                                        null=True,
                                        blank=True)
    form_document = models.JSONField(verbose_name='Form document',
                                     null=True,
                                     blank=True)
    additional_info = models.JSONField(verbose_name='Additional info',
                                       null=True,
                                       blank=True)
    correction_info = models.JSONField(verbose_name='Correction info',
                                       null=True,
                                       blank=True)
    ppc_status = models.JSONField(verbose_name='PPC info',
                                  null=True,
                                  blank=True)
    locked = models.BooleanField(null=True,
                                 blank=True)
    locked_reason = models.CharField(verbose_name='Lock reason',
                                     max_length=25,
                                     choices=lu.LOCKED_REASON,
                                     null=True,
                                     blank=True)
    # legacy, not sure if these fields are needed
    transfer_requested = models.BooleanField(verbose_name='Transfer requested',
                                             null=True,
                                             blank=True)
    transfer_status = models.CharField(verbose_name='Transfer Status',
                                       max_length=200,
                                       null=True,
                                       blank=True)
    original_sub_type = models.CharField(verbose_name='Original Submission Type',
                                         max_length=25,
                                         choices=lu.SUB_TYPE,
                                         null=True)
    transfer_count = models.IntegerField(verbose_name='Transfer Count',
                                         null=True,
                                         blank=True)
    next_transfer_time = models.DateTimeField('Next Transfer Time',
                                              null=True,
                                              blank=True)

    def __str__(self):
        return f'{self.mtn}'


class Handler(models.Model):
    epaSiteId = models.CharField(max_length=25)
    name = models.CharField(max_length=200)
    modified = models.BooleanField()
    registered = models.BooleanField()
    mailingAddress = models.JSONField()
    siteAddress = models.JSONField()
    contact = models.JSONField()
    emergencyPhone = models.JSONField(null=True)
    electronicSignaturesInfo = models.JSONField(null=True)
    gisPrimary = models.BooleanField()
    canEsign = models.BooleanField()
    limitedEsign = models.BooleanField()
    hasRegisteredEmanifestUser = models.BooleanField()

    def __str__(self):
        return f'{self.epaSiteId}'


class ElectronicSignature(models.Model):
    signer_first_name = models.CharField(max_length=200)
    signer_last_name = models.CharField(max_length=200)
    signer_user_id = models.CharField(max_length=200)
    signature_date = models.DateTimeField('signature_date')

    def __str__(self):
        return f'{self.signature_date} by {self.signer_user_id}'


# from sites.models

# TODO: convert EpaSite to something closer to 'MySite' which will have a one-to-one relationship with
#  the Handler model and, in effect, extend it to include information such as waste streams, haztrak user permissions
class EpaSite(models.Model):
    epa_id = models.CharField(max_length=32)
    epa_name = models.CharField(max_length=200, null=True)
    modified = models.BooleanField(null=True)
    has_site_id = models.BooleanField(null=True)
    registered = models.BooleanField(null=True)
    mailing_address = models.ForeignKey('Address', related_name='mailing_address', on_delete=models.CASCADE)
    site_address = models.ForeignKey('Address', related_name='site_address', on_delete=models.CASCADE)
    gis_primary = models.BooleanField(default=False)
    can_esign = models.BooleanField(default=False)
    limited_esign = models.BooleanField(default=True)
    has_emanifest_user = models.BooleanField(default=False)
    site_type = models.CharField(max_length=32, choices=lu.SITE_TYPE, default='GEN')
    federal_generator_status = models.CharField(max_length=32, choices=lu.GEN_STATUS, null=True, default=None)

    def __str__(self):
        return f'{self.epa_id}'


class Address(models.Model):
    street_number = models.IntegerField(null=True, blank=True)
    address1: str = models.CharField(max_length=200)
    address2 = models.CharField(max_length=200, default=None, null=True, blank=True)
    city = models.CharField(max_length=200)
    zip_code = models.CharField(max_length=32)
    state_name = models.CharField(max_length=32, choices=lu.STATES)

    def __str__(self):
        return f'{self.address1}'
