from django.core.validators import MinLengthValidator
from django.db import models


# Create your models here.
class HaztrakSite(models.Model):
    """
    Haztrak Site is a cornerstone model that many other models rely on.
    It wraps around RCRAInfo sites (AKA handlers, our RcraSite object). and adds
    additional functionality and fields.
    """

    class Meta:
        verbose_name = "Haztrak Site"
        verbose_name_plural = "Haztrak Sites"
        ordering = ["rcra_site__epa_id"]

    # ToDo: use UUIDField as primary key

    name = models.CharField(
        verbose_name="site alias",
        max_length=200,
        validators=[MinLengthValidator(2, "site aliases must be longer than 2 characters")],
    )
    rcra_site = models.OneToOneField(
        verbose_name="rcra_site",
        to="rcrasite.RcraSite",
        on_delete=models.CASCADE,
    )
    last_rcrainfo_manifest_sync = models.DateTimeField(
        verbose_name="last RCRAInfo manifest sync date",
        null=True,
        blank=True,
    )
    org = models.ForeignKey(
        "org.HaztrakOrg",
        on_delete=models.CASCADE,
    )

    @property
    def admin_has_rcrainfo_api_credentials(self) -> bool:
        """Returns True if the admin user has RcraInfo API credentials"""
        return self.org.is_rcrainfo_integrated

    def __str__(self):
        """Used in StringRelated fields in serializer classes"""
        return f"{self.rcra_site.epa_id}"


class SitePermissions(models.Model):
    """The Role Based access a user has to a site"""

    class Meta:
        verbose_name = "Site Permission"
        verbose_name_plural = "Site Permissions"
        ordering = ["profile"]

    profile = models.ForeignKey(
        "profile.HaztrakProfile",
        on_delete=models.CASCADE,
        related_name="site_permissions",
    )
    site = models.ForeignKey(
        HaztrakSite,
        on_delete=models.CASCADE,
    )
    emanifest = models.CharField(
        max_length=6,
        default="view",
        choices=[
            ("viewer", "view"),
            ("editor", "edit"),
            ("signer", "sign"),
        ],
    )

    def __str__(self):
        return f"{self.profile.user}"
