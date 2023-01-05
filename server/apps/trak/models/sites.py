from django.db import models

from apps.trak.models import Handler


class Site(models.Model):
    """
    Haztrak Site modal used to control access to Handler object.

    Not to be confused with what are frequently called 'sites' in RCRAInfo, for that,
    see the Handler model.
    """
    name = models.CharField(
        verbose_name='site Alias',
        max_length=200,
    )
    epa_site = models.OneToOneField(
        verbose_name=Handler,
        to=Handler,
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return f'{self.epa_site.epa_id}'
