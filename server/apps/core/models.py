from django.contrib.auth.models import AbstractUser
from django.db import models

from haztrak import settings


class CoreBaseModel(models.Model):
    """Base class for all apps.core models"""

    class Meta:
        abstract = True
        ordering = ["pk"]

    def __str__(self):
        return f"{self.__class__.__name__}"

    def __repr__(self):
        field_values = ", ".join(
            f"{field.name}={getattr(self, field.name)!r}" for field in self._meta.fields
        )
        return f"<{self.__class__.__name__}({field_values})>"


class HaztrakUser(AbstractUser):
    """Haztrak abstract user model. It simply inherits from Django's AbstractUser model."""

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["username"]

    pass


class HaztrakProfile(CoreBaseModel):
    class Meta:
        verbose_name = "Haztrak Profile"
        ordering = ["user__username"]
        default_related_name = "haztrak_profile"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="haztrak_profile",
    )
    rcrainfo_profile = models.OneToOneField(
        "RcraProfile",
        on_delete=models.SET_NULL,
        related_name="haztrak_profile",
        null=True,
        blank=True,
    )
    org = models.ForeignKey(
        "sites.HaztrakOrg",
        on_delete=models.SET_NULL,
        related_name="haztrak_profiles",
        null=True,
        blank=True,
    )

    @property
    def rcrainfo_integrated_org(self) -> bool:
        """Returns true if the user's organization is integrated with RCRAInfo"""
        return self.org.is_rcrainfo_integrated

    def __str__(self):
        return f"{self.user.username}"


class RcraProfile(CoreBaseModel):
    """
    Contains a user's RcraProfile information, such as username, and API credentials.
    Has a one-to-one relationship with the User model.
    """

    class Meta:
        ordering = ["rcra_username"]

    rcra_api_key = models.CharField(
        max_length=128,
        null=True,
        blank=True,
    )
    rcra_api_id = models.CharField(
        max_length=128,
        null=True,
        blank=True,
    )
    rcra_username = models.CharField(
        max_length=128,
        null=True,
        blank=True,
    )
    phone_number = models.CharField(
        max_length=15,
        null=True,
        blank=True,
    )
    email = models.EmailField()

    def __str__(self):
        return f"{self.haztrak_profile.user.username}"

    @property
    def has_rcrainfo_api_id_key(self) -> bool:
        """Returns true if the use has Rcrainfo API credentials"""
        return self.rcra_api_id is not None and self.rcra_api_key is not None
