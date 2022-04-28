from django.db import models

from lib.rcrainfo import lookups as lu


class Manifest(models.Model):
    mtn = models.CharField(verbose_name='Manifest Tracking Number',
                           max_length=15)
    createdDate = models.DateTimeField(verbose_name='Created Date',
                                       null=True,
                                       auto_now=True)
    updatedDate = models.DateTimeField(auto_now=True)
    status = models.CharField(verbose_name='Status',
                              max_length=25,
                              choices=lu.STATUS,
                              default='notAssigned')
    discrepancy = models.BooleanField(verbose_name='Discrepancy',
                                      default=False)
    submissionType = models.CharField(verbose_name='Submission Type',
                                      max_length=25,
                                      choices=lu.SUB_TYPE,
                                      default='FullElectronic')
    originType = models.CharField(verbose_name='Origin Type',
                                  max_length=25,
                                  choices=lu.ORIGIN_TYPE,
                                  default='Service')
    shippedDate = models.DateTimeField(verbose_name='Shipped date',
                                       null=True,
                                       blank=True)
    receivedDate = models.DateTimeField(verbose_name='Received date',
                                        null=True,
                                        blank=True)
    transporters = models.JSONField(verbose_name='Transporters')
    generator = models.ForeignKey('Handler',
                                  verbose_name='Generator',
                                  on_delete=models.PROTECT,
                                  related_name='generator')
    broker = models.JSONField(null=True, blank=True)
    designatedFacility = models.ForeignKey('Handler',
                                           verbose_name='Designated facility',
                                           on_delete=models.PROTECT,
                                           related_name='designated_facility')
    wastes = models.JSONField()
    additionalInfo = models.JSONField(verbose_name='Additional Info',
                                      null=True,
                                      blank=True)
    printedDocument = models.JSONField(verbose_name='Printed Document',
                                       null=True,
                                       blank=True)
    rejection = models.BooleanField(verbose_name='Rejection',
                                    null=True,
                                    blank=True)
    residue = models.BooleanField(verbose_name='Residue',
                                  null=True,
                                  blank=True)
    residueNewManifestTrackingNumbers = models.JSONField(verbose_name='Residue MTN')
    # TODO: The manifest field 'import' conflicts with the python keyword
    importFlag = models.BooleanField(verbose_name='Import',
                                     null=True,
                                     blank=True)
    containsPreviousRejectOrResidue = models.BooleanField(verbose_name='Contains previous rejection or residue',
                                                          null=True,
                                                          blank=True)
    formDocument = models.JSONField(verbose_name='Form Document',
                                    null=True,
                                    blank=True)
    newResidueManifestTrackingNumbers = models.JSONField(verbose_name='New Residue MTN',
                                                         null=True,
                                                         blank=True)
    rejectionInfo = models.JSONField(verbose_name='Rejection Information',
                                     null=True,
                                     blank=True)
    importInfo = models.JSONField(verbose_name='Import Information',
                                  null=True,
                                  blank=True)
    correctionInfo = models.JSONField(verbose_name='Correction Info',
                                      null=True,
                                      blank=True)
    ppcInfo = models.JSONField(verbose_name='PPC Info',
                               null=True,
                               blank=True)
    transferRequested = models.BooleanField(verbose_name='Transfer Requested',
                                            null=True,
                                            blank=True)
    transferStatus = models.CharField(verbose_name='Transfer Status',
                                      max_length=200,
                                      null=True,
                                      blank=True)
    originalSubmissionType = models.CharField(verbose_name='Original Submission Type',
                                              max_length=25,
                                              choices=lu.SUB_TYPE,
                                              null=True)
    potentialShipDate = models.DateTimeField('Potential Ship Date',
                                             null=True,
                                             blank=True)
    reTransferCount = models.IntegerField(verbose_name='Transfer Count',
                                          null=True,
                                          blank=True)
    nextTransferTime = models.DateTimeField('Next Transfer Time',
                                            null=True,
                                            blank=True)
    locked = models.BooleanField(null=True,
                                 blank=True)
    lockReason = models.CharField(verbose_name='Lock Reason',
                                  max_length=25,
                                  null=True,
                                  blank=True)
    certifiedDate = models.DateTimeField(verbose_name='Certified date',
                                         null=True,
                                         blank=True)
    certifiedBy = models.JSONField(verbose_name='Certified By',
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
