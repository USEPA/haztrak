from django.conf import settings
from django.core.validators import MinLengthValidator
from django.db import models
from django.db.models import QuerySet
from guardian.models.models import GroupObjectPermissionBase, UserObjectPermissionBase
from guardian.shortcuts import get_objects_for_user

from core.models import TrakUser


class SiteManager(QuerySet):
    """Query interface for the Site model"""

    def filter_by_username(self: models.Manager, username: str) -> QuerySet:
        """filter a list of sites a user has access to (by username)"""
        return get_objects_for_user(
            TrakUser.objects.get(username=username), "view_site", self.model
        )

    def get_by_user_and_epa_id(
        self: models.Manager, user: settings.AUTH_USER_MODEL, epa_id: str
    ) -> QuerySet:
        """Get a site by EPA ID number that a user has access to"""
        combined_filter: QuerySet = self.filter_by_user(user) & self.filter_by_epa_id(epa_id)
        return combined_filter.get()

    def get_by_username_and_epa_id(self: models.Manager, username: str, epa_id: str) -> QuerySet:
        """Get a site by EPA ID number that a user has access to"""
        combined_filter: QuerySet = self.filter_by_username(username) & self.filter_by_epa_id(
            epa_id
        )
        return combined_filter.get()

    def filter_by_user(self: models.Manager, user: settings.AUTH_USER_MODEL) -> QuerySet:
        """filter a list of sites a user has access to (by user object)"""
        return get_objects_for_user(user, "view_site", self.model)

    def filter_by_epa_id(self: models.Manager, epa_id: str) -> QuerySet:
        """filter a sites by EPA ID number"""
        return self.filter(rcra_site__epa_id=epa_id)

    def filter_by_epa_ids(self: models.Manager, epa_ids: [str]) -> QuerySet:
        """filter a sites by EPA ID number"""
        return self.filter(rcra_site__epa_id__in=epa_ids)

    def get_by_epa_id(self: models.Manager, epa_id: str) -> QuerySet:
        """Get a site by RCRAInfo EPA ID number. Throws Site.DoesNotExist if not found."""
        return self.filter_by_epa_id(epa_id).get()

    def filter_by_org(self: models.Manager, org: settings.TRAK_ORG_MODEL) -> QuerySet:
        """Get a list of sites by organization"""
        return self.filter(org=org)


class Site(models.Model):
    """
    Haztrak Site is a cornerstone model that many other models rely on.
    It wraps around RCRAInfo sites (AKA handlers, our RcraSite object). and adds
    additional functionality and fields.
    """

    objects = SiteManager.as_manager()

    class Meta:
        verbose_name = "Haztrak Site"
        verbose_name_plural = "Haztrak Sites"
        ordering = ["rcra_site__epa_id"]

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


class SiteAccess(models.Model):
    """The Role Based access a user has to a site"""

    class Meta:
        verbose_name = "Site Permission"
        verbose_name_plural = "Site Permissions"
        ordering = ["user"]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="site_permissions",
    )
    site = models.ForeignKey(
        Site,
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


class SiteUserObjectPermission(UserObjectPermissionBase):
    """Site object level permission."""

    class Meta(UserObjectPermissionBase.Meta):
        verbose_name = "Site Permission"
        verbose_name_plural = "Site Permissions"

    content_object = models.ForeignKey(Site, on_delete=models.CASCADE)


class SiteGroupObjectPermission(GroupObjectPermissionBase):
    """Site object level Group."""

    class Meta(GroupObjectPermissionBase.Meta):
        verbose_name = "Site Role"
        verbose_name_plural = "Site Roles"

    content_object = models.ForeignKey(Site, on_delete=models.CASCADE)
