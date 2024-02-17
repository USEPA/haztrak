from django.conf import settings
from django.core.validators import MinLengthValidator
from django.db import models


class TrakSiteManager(models.Manager):
    """Custom manager for TrakSite model"""

    def filter_by_username(self: models.Manager, username: str) -> models.QuerySet:
        """filter a list of sites a user has access to (by username)"""
        return self.select_related("rcra_site").filter(traksiteaccess__user__username=username)

    def filter_by_user(self: models.Manager, user: settings.AUTH_USER_MODEL) -> models.QuerySet:
        """filter a list of sites a user has access to (by user object)"""
        return self.select_related("rcra_site").filter(traksiteaccess__user=user)

    def filter_by_epa_id(self: models.Manager, epa_id: str) -> models.QuerySet:
        """Get a sites by EPA ID number"""
        return self.filter(rcra_site__epa_id=epa_id)


class TrakSite(models.Model):
    """
    Haztrak Site is a cornerstone model that many other models rely on.
    It wraps around RCRAInfo sites (AKA handlers, our RcraSite object). and adds
    additional functionality and fields.
    """

    objects = TrakSiteManager()

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
        to=settings.TRAK_RCRAINFO_SITE_MODEL,
        on_delete=models.CASCADE,
    )
    last_rcrainfo_manifest_sync = models.DateTimeField(
        verbose_name="last RCRAInfo manifest sync date",
        null=True,
        blank=True,
    )
    org = models.ForeignKey(
        settings.TRAK_ORG_MODEL,
        on_delete=models.CASCADE,
    )

    @property
    def admin_has_rcrainfo_api_credentials(self) -> bool:
        """Returns True if the admin user has RcraInfo API credentials"""
        return self.org.is_rcrainfo_integrated

    def __str__(self):
        """Used in StringRelated fields in serializer classes"""
        return f"{self.rcra_site.epa_id}"


class TrakSiteAccess(models.Model):
    """The Role Based access a user has to a site"""

    class Meta:
        verbose_name = "New Site Permission"
        verbose_name_plural = "New Site Permissions"
        ordering = ["user"]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="site_permissions",
    )
    site = models.ForeignKey(
        TrakSite,
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
        return f"{self.user.username}"
