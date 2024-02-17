import uuid

from django.conf import settings
from django.db import models

from apps.profile.models import RcrainfoProfile


class TrakOrg(models.Model):
    """Haztrak Organization"""

    class Meta:
        verbose_name = "Organization"
        verbose_name_plural = "Organizations"
        ordering = ["name"]

    name = models.CharField(
        max_length=200,
        unique=True,
    )
    id = models.UUIDField(
        unique=True,
        editable=False,
        primary_key=True,
        default=uuid.uuid4,
    )
    admin = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    @property
    def rcrainfo_api_id_key(self) -> tuple[str, str] | None:
        """Returns the RcraInfo API credentials for the admin user"""
        try:
            rcrainfo_profile = RcrainfoProfile.objects.get(haztrak_profile__user=self.admin)
            return rcrainfo_profile.rcra_api_id, rcrainfo_profile.rcra_api_key
        except RcrainfoProfile.DoesNotExist:
            return None

    @property
    def is_rcrainfo_integrated(self) -> bool:
        """Returns True if the admin user has RcraInfo API credentials"""
        if RcrainfoProfile.objects.filter(haztrak_profile__user=self.admin).exists():
            return RcrainfoProfile.objects.get(
                haztrak_profile__user=self.admin
            ).has_rcrainfo_api_id_key
        else:
            return False

    def __str__(self):
        return f"{self.name}"


class TrakOrgAccess(models.Model):
    """Organization Permissions"""

    class Meta:
        verbose_name = "Organization Permission"
        verbose_name_plural = "Org Permissions"

    org = models.ForeignKey(
        TrakOrg,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        related_name="org_permissions",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.user} - {self.org}"
