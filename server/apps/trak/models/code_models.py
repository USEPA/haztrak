import logging

from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.trak.models.base_model import TrakBaseModel

logger = logging.getLogger(__name__)


class EpaCodeBase(TrakBaseModel):
    """Abstract base class for Epa Lookups and codes"""

    code = models.CharField(
        max_length=2,
    )
    description = models.TextField(
        blank=True,
        null=True,
    )

    def __str__(self):
        if len(self.description) > 35:
            description = f"{self.description[:32]}..."
        else:
            description = f"{self.description}"
        return f"{self.code}: {description} "

    class Meta:
        abstract = True


class FederalWasteCodeManager(models.Manager):
    """WasteCode model manager for dealing with Federal Waste Codes"""

    def get_queryset(self):
        return super().get_queryset().filter(code_type=WasteCode.CodeType.FEDERAL)


class StateWasteCodeManager(models.Manager):
    """WasteCode model manager for dealing with State Waste Codes"""

    def get_queryset(self):
        return super().get_queryset().filter(code_type=WasteCode.CodeType.STATE)


class WasteCode(EpaCodeBase):
    """Manifest Federal and state waste codes"""

    objects = models.Manager()
    federal = FederalWasteCodeManager()
    state = StateWasteCodeManager()

    class CodeType(models.TextChoices):
        STATE = "ST", _("State")
        FEDERAL = "FD", _("Federal")

    code = models.CharField(
        max_length=6,
    )

    code_type = models.CharField(
        choices=CodeType.choices,
        max_length=2,
    )
