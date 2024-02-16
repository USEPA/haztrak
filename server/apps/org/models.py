import uuid

from django.db import models

from apps.core.models import RcrainfoProfile


class HaztrakOrg(models.Model):
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
        "core.HaztrakUser",
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
