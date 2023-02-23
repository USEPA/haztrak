from django.core.validators import MinValueValidator
from django.db import models

from .handler import Handler


class Site(models.Model):
    """
    Haztrak Site model used to control access to Handler object.

    Not to be confused with what are frequently called 'sites' in RCRAInfo, for that,
    see the Handler model.
    """

    name = models.CharField(
        verbose_name="site Alias",
        max_length=200,
        validators=[MinValueValidator(2, "site aliases must be longer than 2 characters")],
    )
    epa_site = models.OneToOneField(
        verbose_name="Handler",
        to=Handler,
        on_delete=models.CASCADE,
    )
    last_rcra_sync = models.DateTimeField(
        verbose_name="Last Sync with RCRAInfo",
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.epa_site.epa_id}"
