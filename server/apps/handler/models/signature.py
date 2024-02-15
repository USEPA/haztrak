import logging
from datetime import datetime, timezone
from typing import List, Literal, Optional

from django.db import models

from apps.handler.models.base_models import TrakBaseManager, TrakBaseModel

logger = logging.getLogger(__name__)


class Signer(models.Model):
    """EPA manifest signer definition"""

    class Meta:
        ordering = ["first_name"]

    class Role(models.TextChoices):
        INDUSTRY = "Industry"
        PPC = "PPC"
        EPA = "EPA"
        STATE = "State"

    class ContactType(models.TextChoices):
        EMAIL = "email"
        VOICE = "voice"
        TEXT = "text"

    rcra_user_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )
    first_name = models.CharField(
        max_length=38,
        blank=True,
        null=True,
    )
    middle_initial = models.CharField(
        max_length=1,
        blank=True,
        null=True,
    )
    last_name = models.CharField(
        max_length=38,
        blank=True,
        null=True,
    )
    phone = models.ForeignKey(
        "ManifestPhone",
        on_delete=models.CASCADE,
        null=True,
    )
    email = models.CharField(
        max_length=38,
        blank=True,
        null=True,
    )
    company_name = models.CharField(
        max_length=80,
        blank=True,
        null=True,
    )
    contact_type = models.CharField(
        max_length=5,
        choices=ContactType.choices,
        blank=True,
        null=True,
    )
    signer_role = models.CharField(
        max_length=10,
        choices=Role.choices,
        null=True,
    )

    def __str__(self):
        return (
            f"{(lambda i: i or '')(self.first_name)}, "
            f"{(lambda i: i or '')(self.middle_initial)} "
            f"{(lambda i: i or '')(self.last_name)}"
        )


class ESignatureManager(TrakBaseManager):
    """
    Inter-model related functionality for ESignature Model
    """

    def save(self, **e_signature_data):
        """
        Create Contact instance in database, create related phone instance if applicable,
        and return the new instance.
        """
        if "signer" in e_signature_data:
            e_signature_data["signer"] = Signer.objects.create(**e_signature_data.pop("signer"))
        return super().save(**e_signature_data)


class ESignature(TrakBaseModel):
    """EPA electronic signature"""

    class Meta:
        verbose_name = "e-Signature"
        ordering = ["sign_date"]

    objects = ESignatureManager()

    manifest_handler = models.ForeignKey(
        "handler.Handler",
        related_name="e_signatures",
        on_delete=models.CASCADE,
    )
    signer = models.OneToOneField(
        "Signer",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    sign_date = models.DateTimeField(
        blank=True,
        null=True,
    )
    cromerr_activity_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )
    cromerr_document_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )
    on_behalf = models.BooleanField(
        default=False,
        blank=True,
        null=True,
    )

    def __str__(self):
        if self.signer is not None:
            return (
                f"{(lambda i: i or '')(self.signer.first_name)}, "
                f"{(lambda i: i or '')(self.signer.middle_initial)} "
                f"{(lambda i: i or '')(self.signer.last_name)}"
                f"e-signature on {self.sign_date}"
            )
        return f"e-signature on {self.sign_date}"


class PaperSignature(TrakBaseModel):
    """
    Contains printed name of the rcra_site Signee and
    Date of Signature for paper manifests.
    """

    printed_name = models.CharField(
        max_length=255,
    )
    sign_date = models.DateTimeField()

    def __str__(self):
        return f"{self.printed_name} ({self.sign_date.strftime('%Y-%m-%d %H:%M:%S')})"

    def __hash__(self):
        return hash((self.printed_name, self.sign_date))


class QuickerSign:
    """
    Quicker Sign is the python object representation of the EPA's Quicker Sign schema
    This is not a django model, however for the time being we do not have a better location
    """

    def __init__(
        self,
        mtn: List[str],
        printed_name: str,
        site_type: Literal["Generator", "Tsdf", "Transporter"],
        site_id: str,
        printed_date: Optional[datetime | str] = datetime.utcnow().replace(tzinfo=timezone.utc),
        transporter_order: Optional[int] = None,
    ):
        self.mtn = mtn
        self.printed_name = printed_name
        self.site_type = site_type
        self.site_id = site_id
        self.transporter_order = transporter_order
        # Check if printed_date is datetime object of string
        if isinstance(printed_date, datetime):
            self.printed_date: datetime = printed_date
        # If it's a string, it should be in the appropriate ISO format
        elif isinstance(printed_date, str):
            try:
                self.printed_date: datetime = datetime.fromisoformat(printed_date)
            # If error, default to current time
            except ValueError:
                self.printed_date: datetime = datetime.utcnow().replace(tzinfo=timezone.utc)
        else:
            raise TypeError(
                f"printed_date must be string or datetime, received {type(printed_date)}"
            )
