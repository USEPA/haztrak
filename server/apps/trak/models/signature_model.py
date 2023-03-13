import logging

from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.trak.models.base_model import TrakManager

logger = logging.getLogger(__name__)


class Signer(models.Model):
    """EPA manifest signer definition"""

    class Role(models.TextChoices):
        INDUSTRY = "IN", _("Industry")
        PPC = "PP", _("Ppc")
        EPA = "EP", _("Epa")
        STATE = "ST", _("State")

    class ContactType(models.TextChoices):
        EMAIL = "EM", _("Email")
        VOICE = "VO", _("Voice")
        TEXT = "TX", _("Text")

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
        "EpaPhone",
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
        max_length=2,
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


class ESignatureManager(TrakManager):
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


class ESignature(models.Model):
    """EPA electronic signature"""

    objects = ESignatureManager()

    manifest_handler = models.ForeignKey(
        "ManifestHandler",
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

    def __repr__(self):
        field_values = ", ".join(
            f"{field.name}={getattr(self, field.name)!r}" for field in self._meta.fields
        )
        return f"<{self.__class__.__name__}({field_values})>"

    class Meta:
        verbose_name = "e-Signature"


class PaperSignature(models.Model):
    """
    Contains printed name of the handler Signee and
    Date of Signature for paper manifests.
    """

    printed_name = models.CharField(
        max_length=255,
    )
    sign_date = models.DateTimeField()

    def __str__(self):
        return f"{self.printed_name} ({self.sign_date.strftime('%Y-%m-%d %H:%M:%S')})"

    def __repr__(self):
        field_values = ", ".join(
            f"{field.name}={getattr(self, field.name)!r}" for field in self._meta.fields
        )
        return f"<{self.__class__.__name__}({field_values})>"

    def __hash__(self):
        return hash((self.printed_name, self.sign_date))
