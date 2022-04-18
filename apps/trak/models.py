import datetime

from django.db import models

from apps.sites.models import EpaSite
from rcrainfo import global_choices as ri


class Manifest(models.Model):
    manifestTrackingNumber = models.CharField(max_length=15)
    createdDate = models.DateTimeField(null=True)
    updatedDate = models.DateTimeField(default=datetime.datetime.now())
    status = models.CharField(max_length=25,
                              choices=ri.STATUS,
                              default='notAssigned')
    submissionType = models.CharField(max_length=25,
                                      choices=ri.SUB_TYPE,
                                      default='FullElectronic')
    originType = models.CharField(max_length=25,
                                  choices=ri.ORIGIN_TYPE,
                                  default='Service')
    shippedDate = models.DateTimeField('Shipped date', null=True)
    receivedDate = models.DateTimeField('Received date', null=True)
    # Handler information currently saved as JSON field instead of nested objects
    # TODO: investigate and design conversion from JSONFields to nested objects,
    # I believe will require implementing custom create() and update() methods for the
    # rest framework serializer
    transporters = models.JSONField()
    generator = models.ForeignKey('Handler', on_delete=models.PROTECT)
    broker = models.JSONField(null=True)
    designatedFacility = models.JSONField()
    # Wastes and other fields stored as JSON field
    wastes = models.JSONField()
    additionalInfo = models.JSONField(null=True)
    printedDocument = models.JSONField(null=True)
    # More basics fields
    rejection = models.BooleanField(null=True)
    residue = models.BooleanField(null=True)
    importFlag = models.BooleanField(null=True)
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
                                              choices=ri.SUB_TYPE,
                                              null=True)
    potentialShipDate = models.DateTimeField('Potential Ship Date', null=True)
    reTransferCount = models.IntegerField(null=True)
    nextTransferTime = models.DateTimeField('Next Transfer Time', null=True)
    locked = models.BooleanField(null=True)
    lockReason = models.CharField(max_length=25, null=True)
    certifiedDate = models.DateTimeField('Certified date', null=True)
    certifiedBy = models.JSONField(null=True)

    def __str__(self):
        return self.manifestTrackingNumber


class Handler(models.Model):
    epaSiteId = models.CharField(max_length=25, unique=True)

    def __str__(self):
        return self.epaSiteId


class ElectronicSignature(models.Model):
    signer_first_name = models.CharField(max_length=200)
    signer_last_name = models.CharField(max_length=200)
    signer_user_id = models.CharField(max_length=200)
    signature_date = models.DateTimeField('signature_date')

    def __str__(self):
        return f'{self.signature_date} by {self.signer_user_id}'
