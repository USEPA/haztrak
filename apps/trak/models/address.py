from django.db import models

from lib.rcrainfo import lookups as lu


class Address(models.Model):
    street_number = models.CharField(
        max_length=12,
        null=True,
        blank=True,
    )
    address1 = models.CharField(
        verbose_name='Address 1',
        max_length=50,
    )
    address2 = models.CharField(
        verbose_name='Address 2',
        max_length=50,
        default=None,
        null=True,
        blank=True,
    )
    city = models.CharField(
        max_length=25,
    )
    state = models.CharField(
        max_length=3,
        null=True,
        blank=True,
        choices=lu.STATES,
    )
    country = models.CharField(
        max_length=3,
        null=True,
        blank=True,
        choices=lu.COUNTRIES,
    )
    zip = models.CharField(
        null=True,
        blank=True,
        max_length=5,
    )

    def __str__(self):
        if self.street_number:
            return f'{self.street_number} {self.address1}'
        else:
            return f' {self.address1}'
