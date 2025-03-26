"""Model for phone numbers on a manifest."""

from re import match

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _


class ManifestPhoneNumber(models.CharField):
    """RCRAInfo's representation of a phone."""

    def validate(self, value, model_instance):
        """Ensure that the phone number is in the format ###-###-####."""
        if not match(r"^\d{3}-\d{3}-\d{4}$", value):
            raise ValidationError(
                _("%(value)s should be a phone with format ###-###-####"),
                params={"value": value},
            )


class ManifestPhone(models.Model):
    """RCRAInfo representation of phone numbers on a manifest."""

    number = ManifestPhoneNumber(
        max_length=12,
    )
    extension = models.CharField(
        max_length=6,
        null=True,
        blank=True,
    )

    class Meta:
        """Metaclass."""

        ordering = ["number"]

    def __str__(self):
        """Human-readable representation."""
        if self.extension:
            return f"{self.number} Ext. {self.extension}"
        return f"{self.number}"
