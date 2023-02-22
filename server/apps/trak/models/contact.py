from re import match

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _


class EpaPhoneNumber(models.CharField):
    """
    EpaPhoneNumber encapsulates RCRAInfo's representation of a phone (not including extensions)
    """

    def validate(self, value, model_instance):
        if not match(r"^\d{3}-\d{3}-\d{4}$", value):
            raise ValidationError(
                _("%(value)s should be a phone with format ###-###-####"),
                params={"value": value},
            )


class EpaPhone(models.Model):
    """
    RCRAInfo phone model, stores phones in ###-###-#### format
    along with up to 6 digit extension.
    """

    number = EpaPhoneNumber(
        max_length=12,
    )
    extension = models.CharField(max_length=6, null=True, blank=True)

    def __str__(self):
        if self.extension:
            return f"{self.number} Ext. {self.extension}"
        return f"{self.number}"


class ContactManager(models.Manager):
    """
    Inter-model related functionality for Contact Model
    """

    def create(self, contact=None, **contact_data):
        """
        Create Contact instance in database, create related phone instance if applicable,
        and return the new instance.
        """
        if isinstance(contact, Contact):
            return contact
        if "phone" in contact_data:
            phone_data = contact_data.pop("phone")
            if isinstance(phone_data, EpaPhone):
                phone = phone_data
            else:
                phone = EpaPhone.objects.create(**phone_data)
            return super().create(**contact_data, phone=phone)
        return super().create(**contact_data)


class Contact(models.Model):
    """
    RCRAInfo contact including personnel information such as name, email, company,
    includes a phone related field.
    """

    objects = ContactManager()

    first_name = models.CharField(max_length=38, null=True, blank=True)
    middle_initial = models.CharField(max_length=1, null=True, blank=True)
    last_name = models.CharField(max_length=38, null=True, blank=True)
    phone = models.ForeignKey(
        EpaPhone,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    email = models.EmailField()
    company_name = models.CharField(max_length=80, null=True, blank=True)

    def __str__(self):
        try:
            first = self.first_name if self.first_name else ""
            middle = self.middle_initial if self.middle_initial else ""
            last = self.last_name if self.last_name else ""
            return (
                f"contact {self.pk}: {first.capitalize()} {middle.capitalize()} "
                f"{last.capitalize()}"
            )
        except AttributeError:
            return f"contact {self.pk}: {self.first_name} {self.middle_initial} {self.last_name}"

    def __repr__(self):
        return f"Contact {self.pk}"
