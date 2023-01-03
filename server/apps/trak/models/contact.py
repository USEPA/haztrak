import re

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _


class EpaPhoneNumber(models.CharField):

    def validate(self, value, model_instance):
        if not re.match(r'^\d{3}-\d{3}-\d{4}$', value):
            raise ValidationError(
                _('%(value)s should be a phone with format ###-###-####'),
                params={'value': value},
            )


class EpaPhone(models.Model):
    number = EpaPhoneNumber(
        max_length=12,
    )
    extension = models.CharField(
        max_length=6,
        null=True,
        blank=True
    )

    def __str__(self):
        if self.extension:
            return f'{self.number} Ext. {self.extension}'
        else:
            return f'{self.number}'


class Contact(models.Model):
    first_name = models.CharField(
        max_length=38,
        null=True,
        blank=True
    )
    middle_initial = models.CharField(
        max_length=1,
        null=True,
        blank=True
    )
    last_name = models.CharField(
        max_length=38,
        null=True,
        blank=True
    )
    phone = models.ForeignKey(
        EpaPhone,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    email = models.EmailField()
    company_name = models.CharField(
        max_length=80,
        null=True,
        blank=True
    )

    def __str__(self):
        try:
            first = self.first_name if self.first_name else ''
            middle = self.middle_initial if self.middle_initial else ''
            last = self.last_name if self.last_name else ''
            return f'{first.capitalize()} {middle.capitalize()} {last.capitalize()}'
        except AttributeError:
            return f'{self.first_name} {self.middle_initial} {self.last_name}'
