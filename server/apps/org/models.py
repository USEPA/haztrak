import uuid

from django.conf import settings
from django.db import models
from guardian.models.models import GroupObjectPermissionBase, UserObjectPermissionBase

from apps.profile.models import RcrainfoProfile


class OrgManager(models.Manager):
    """Organization Repository manager"""

    def get_by_username(self, username: str) -> "Org":
        return self.get(orgaccess__user__username=username)


class Org(models.Model):
    """Haztrak Organization"""

    objects = OrgManager()

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


class OrgAccess(models.Model):
    """Organization Permissions"""

    class Meta:
        verbose_name = "Organization Permission"
        verbose_name_plural = "Org Permissions"

    org = models.ForeignKey(
        Org,
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


class OrgUserObjectPermission(UserObjectPermissionBase):
    """Org object level permission."""

    content_object = models.ForeignKey(Org, on_delete=models.CASCADE)


class OrgGroupObjectPermission(GroupObjectPermissionBase):
    """Org object level Group."""

    content_object = models.ForeignKey(Org, on_delete=models.CASCADE)
