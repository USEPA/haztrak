from django.db import models
from django.utils.translation import gettext_lazy as _


class Signer(models.Model):
    class SignerRole(models.TextChoices):
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
        choices=SignerRole.choices,
        null=True,
    )

    def __str__(self):
        return (
            f"{(lambda i: i or '')(self.first_name)}, "
            f"{(lambda i: i or '')(self.middle_initial)} "
            f"{(lambda i: i or '')(self.last_name)}"
        )


class ESignature(models.Model):
    signer = models.ForeignKey(
        "Signer",
        on_delete=models.CASCADE,
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
    )

    def __str__(self):
        return (
            f"{(lambda i: i or '')(self.signer.first_name)}, "
            f"{(lambda i: i or '')(self.signer.middle_initial)} "
            f"{(lambda i: i or '')(self.signer.last_name)}"
        )

    class Meta:
        verbose_name = "e-Signature"
