from datetime import datetime

from django.db import models

from apps.trak.models import Handler
from lib.rcrainfo import lookups as lu


def draft_mtn():
    """
    A callable that returns a timestamped draft MTN in lieu of an
    official MTN from e-Manifest
    """
    return str(f'draft-{datetime.now().strftime("%Y-%m-%d-%H:%M:%S")}')


class ManifestManager(models.Manager):
    """
    Inter-modal related functionality for Manifest Modal
    """

    @staticmethod
    def create_with_related(manifest_data):
        # pop foreign table data
        tsd_data = manifest_data.pop('tsd')
        gen_data = manifest_data.pop('generator')
        # Secondary foreign table data
        if Handler.objects.filter(epa_id=gen_data['epa_id']).exists():
            gen_object = Handler.objects.get(epa_id=gen_data['epa_id'])
        else:
            gen_object = Handler.objects.create_with_related(**gen_data)
        if Handler.objects.filter(epa_id=tsd_data['epa_id']).exists():
            tsd_object = Handler.objects.get(epa_id=tsd_data['epa_id'])
        else:
            tsd_object = Handler.objects.create_with_related(**tsd_data)

        # Create model instances
        manifest = Manifest.objects.create(generator=gen_object,
                                           tsd=tsd_object,
                                           **manifest_data)
        return manifest


class Manifest(models.Model):
    """
    Modal definition the e-Manifest Uniform Hazardous Waste Manifest
    """
    objects = ManifestManager()

    created_date = models.DateTimeField(
        null=True,
        auto_now=True,
    )
    update_date = models.DateTimeField(
        auto_now=True,
    )
    mtn = models.CharField(
        verbose_name='manifest Tracking Number',
        max_length=15,
        default=draft_mtn
    )
    status = models.CharField(
        max_length=25,
        choices=lu.STATUS,
        default='NotAssigned',
    )
    submission_type = models.CharField(
        max_length=25,
        choices=lu.SUB_TYPE,
        default='FullElectronic',
    )
    signature_status = models.BooleanField(
        null=True,
        blank=True,
    )
    origin_type = models.CharField(
        max_length=25,
        choices=lu.ORIGIN_TYPE,
        default='Service',
    )
    shipped_date = models.DateTimeField(
        null=True,
        blank=True,
    )
    potential_ship_date = models.DateTimeField(
        verbose_name='Potential ship date',
        null=True,
        blank=True,
    )
    received_date = models.DateTimeField(
        null=True,
        blank=True,
    )
    certified_date = models.DateTimeField(
        null=True,
        blank=True,
    )
    certified_by = models.JSONField(
        null=True,
        blank=True,
    )
    generator = models.ForeignKey(
        Handler,
        on_delete=models.PROTECT,
        related_name='generator',
    )
    # transporters
    tsd = models.ForeignKey(
        Handler,
        verbose_name='Designated facility',
        on_delete=models.PROTECT,
        related_name='designated_facility',
    )
    broker = models.JSONField(
        null=True, blank=True)
    # wastes
    rejection = models.BooleanField(
        blank=True,
        default=False,
    )
    rejection_info = models.JSONField(
        verbose_name='Rejection Information',
        null=True,
        blank=True,
    )
    discrepancy = models.BooleanField(
        blank=True,
        default=False,
    )
    residue = models.BooleanField(
        blank=True,
        default=False,
    )
    residue_new_mtn = models.JSONField(
        verbose_name='Residue new MTN',
        blank=True,
        default=list,
    )
    import_flag = models.BooleanField(
        verbose_name='Import',
        blank=True,
        default=False,
    )
    import_info = models.JSONField(
        verbose_name='Import information',
        null=True,
        blank=True,
    )
    contains_residue_or_rejection = models.BooleanField(
        verbose_name='Contains previous rejection or residue waste',
        null=True,
        blank=True,
    )
    printed_document = models.JSONField(
        null=True,
        blank=True,
    )
    form_document = models.JSONField(
        null=True,
        blank=True,
    )
    additional_info = models.JSONField(
        null=True,
        blank=True,
    )
    correction_info = models.JSONField(
        null=True,
        blank=True,
    )
    ppc_status = models.JSONField(
        verbose_name='PPC info',
        null=True,
        blank=True,
    )
    locked = models.BooleanField(
        null=True,
        blank=True,
    )
    locked_reason = models.CharField(
        max_length=25,
        choices=lu.LOCKED_REASON,
        null=True,
        blank=True,
    )
    transfer_requested = models.BooleanField(
        null=True,
        blank=True,
    )
    transfer_status = models.CharField(
        max_length=200,
        null=True,
        blank=True,
    )
    original_sub_type = models.CharField(
        verbose_name='Original Submission Type',
        max_length=25,
        choices=lu.SUB_TYPE,
        null=True,
    )
    transfer_count = models.IntegerField(
        null=True,
        blank=True,
    )
    next_transfer_time = models.DateTimeField(
        verbose_name='Next Transfer Time',
        null=True,
        blank=True,
    )

    def get_absolute_url(self):
        from django.urls import reverse
        return reverse('manifest_details', kwargs={'pk': self.pk})

    def __str__(self):
        return f'{self.mtn}'
