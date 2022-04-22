from django.db import models

from lib.rcrainfo import lookups as lu


class Manifest(models.Model):
    manifestTrackingNumber = models.CharField(max_length=15)
    createdDate = models.DateTimeField(null=True)
    updatedDate = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=25,
                              choices=lu.STATUS,
                              default='notAssigned')
    discrepancy = models.BooleanField(default=False)
    submissionType = models.CharField(max_length=25,
                                      choices=lu.SUB_TYPE,
                                      default='FullElectronic')
    originType = models.CharField(max_length=25,
                                  choices=lu.ORIGIN_TYPE,
                                  default='Service')
    shippedDate = models.DateTimeField('Shipped date', null=True)
    receivedDate = models.DateTimeField('Received date', null=True)
    transporters = models.JSONField()
    generator = models.ForeignKey('Handler',
                                  on_delete=models.PROTECT,
                                  related_name='Generator')
    broker = models.JSONField(null=True)
    # designatedFacility = models.JSONField()
    designatedFacility = models.ForeignKey('Handler',
                                           on_delete=models.PROTECT,
                                           related_name='Designated_Facility')
    wastes = models.JSONField()
    additionalInfo = models.JSONField(null=True)
    printedDocument = models.JSONField(null=True)
    rejection = models.BooleanField(null=True)
    residue = models.BooleanField(null=True)
    residueNewManifestTrackingNumbers = models.JSONField()
    # TODO: The manifest field 'import' conflicts with the python keyword
    importFlag = models.BooleanField('import', null=True)
    containsPreviousRejectOrResidue = models.BooleanField(null=True)
    formDocument = models.JSONField(null=True)
    newResidueManifestTrackingNumbers = models.JSONField(null=True)
    rejectionInfo = models.JSONField(null=True)
    importInfo = models.JSONField(null=True)
    correctionInfo = models.JSONField(null=True)
    ppcInfo = models.JSONField(null=True)
    transferRequested = models.BooleanField(null=True)
    transferStatus = models.CharField(max_length=200, null=True)
    originalSubmissionType = models.CharField(max_length=25,
                                              choices=lu.SUB_TYPE,
                                              null=True)
    potentialShipDate = models.DateTimeField('Potential Ship Date', null=True)
    reTransferCount = models.IntegerField(null=True)
    nextTransferTime = models.DateTimeField('Next Transfer Time', null=True)
    locked = models.BooleanField(null=True)
    lockReason = models.CharField(max_length=25, null=True)
    certifiedDate = models.DateTimeField('Certified date', null=True)
    certifiedBy = models.JSONField(null=True)

    def __str__(self):
        return f'{self.manifestTrackingNumber}'


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
    address2 = models.CharField(max_length=200, default=None, blank=True)
    city = models.CharField(max_length=200)
    zip_code = models.CharField(max_length=32)
    state_name = models.CharField(max_length=32, choices=lu.STATES)

    def __str__(self):
        return f'{self.address1}'
