from django.core.validators import MinValueValidator
from django.db import models

from apps.trak.models import EpaSite
from apps.trak.models.base_model import TrakBaseModel


class Site(TrakBaseModel):
    """
    Haztrak Site model used to control access to EpaSite object.

    Not to be confused with what are frequently called 'sites' in RCRAInfo, for that,
    see the EpaSite model.
    """

    class Meta:
        ordering = ["epa_site__epa_id"]

    name = models.CharField(
        verbose_name="site alias",
        max_length=200,
        validators=[MinValueValidator(2, "site aliases must be longer than 2 characters")],
    )
    epa_site = models.OneToOneField(
        verbose_name="epa_site",
        to=EpaSite,
        on_delete=models.CASCADE,
    )
    last_rcra_sync = models.DateTimeField(
        verbose_name="last sync with RCRAInfo",
        null=True,
        blank=True,
    )

    def __str__(self):
        if self.name:
            return f"{self.name}"
        return f"{self.epa_site.epa_id}"
