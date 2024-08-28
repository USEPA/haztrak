import uuid
from typing import TYPE_CHECKING

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models

if TYPE_CHECKING:
    from django.contrib.auth.models import User


class ProfileManager(models.QuerySet):
    """Query manager for the TrakProfile model."""

    def get_profile_by_user(self, user: "User") -> "Profile":
        return self.get(user=user)


class Profile(models.Model):
    """
    User information outside the scope of the User model.
    Contains a one-to-one relationship with the User model
    """

    objects = ProfileManager.as_manager()

    class Meta:
        verbose_name = "Haztrak Profile"
        ordering = ["user__username"]
        default_related_name = "haztrak_profile"

    id = models.UUIDField(
        primary_key=True,
        editable=False,
        default=uuid.uuid4,
    )
    user: "User" = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="haztrak_profile",
    )
    rcrainfo_profile = models.OneToOneField(
        "profile.RcrainfoProfile",
        on_delete=models.SET_NULL,
        related_name="haztrak_profile",
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.user.username}"


class RcrainfoProfileManager(models.Manager):
    """Query manager for the RcrainfoProfile model."""

    def get_by_trak_username(self, username: str) -> "RcrainfoProfile":
        return self.get(haztrak_profile__user__username=username)


class RcrainfoProfile(models.Model):
    """
    Contains a user's RcrainfoProfile information, such as username, and API credentials.
    Has a one-to-one relationship with the User model.
    """

    objects = RcrainfoProfileManager()

    class Meta:
        ordering = ["rcra_username"]

    id = models.UUIDField(
        primary_key=True,
        editable=False,
        default=uuid.uuid4,
    )
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


class RcrainfoSiteAccess(models.Model):
    """Permissions a user has in their RCRAInfo account"""

    CERTIFIER = "Certifier"
    PREPARER = "Preparer"
    VIEWER = "Viewer"

    EPA_PERMISSION_LEVEL = [
        (CERTIFIER, "Certifier"),
        (PREPARER, "Preparer"),
        (VIEWER, "Viewer"),
    ]

    class Meta:
        verbose_name = "RCRAInfo Permission"
        verbose_name_plural = "RCRAInfo Permissions"
        ordering = ["site"]

    site = models.CharField(
        max_length=12,
    )
    profile = models.ForeignKey(
        RcrainfoProfile,
        on_delete=models.PROTECT,
        related_name="permissions",
    )
    site_manager = models.BooleanField(
        default=False,
    )
    annual_report = models.CharField(
        max_length=12,
        choices=EPA_PERMISSION_LEVEL,
    )
    biennial_report = models.CharField(
        max_length=12,
        choices=EPA_PERMISSION_LEVEL,
    )
    e_manifest = models.CharField(
        max_length=12,
        choices=EPA_PERMISSION_LEVEL,
    )
    my_rcra_id = models.CharField(
        max_length=12,
        choices=EPA_PERMISSION_LEVEL,
    )
    wiets = models.CharField(
        max_length=12,
        choices=EPA_PERMISSION_LEVEL,
    )

    def __str__(self):
        return f"{self.site}"

    def clean(self):
        if self.site_manager:
            fields = ["annual_report", "biennial_report", "e_manifest", "my_rcra_id", "wiets"]
            for field_name in fields:
                if getattr(self, field_name) != "Certifier":
                    raise ValidationError(
                        f"If Site Manager, '{field_name}' field must be set to 'Certifier'."
                    )
