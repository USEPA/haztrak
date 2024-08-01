import uuid
from profile.models import RcrainfoProfile

from django.conf import settings
from django.core.validators import MinLengthValidator
from django.db import models
from django.db.models import QuerySet
from django_extensions.db.fields import AutoSlugField
from guardian.models import GroupObjectPermissionBase, UserObjectPermissionBase
from guardian.shortcuts import get_objects_for_user

from core.models import TrakUser


class OrgManager(models.Manager):
    """Organization Repository manager"""

    def get_by_username(self, username: str) -> "Org":
        user = TrakUser.objects.get(username=username)
        # ToDo: Currently we are assuming the use only has one org
        orgs: QuerySet["Org"] = get_objects_for_user(
            user, "view_org", self.model, accept_global_perms=False
        )
        return orgs.first()

    def get_by_slug(self, slug: str) -> "Org":
        return self.model.objects.get(slug=slug)


class Org(models.Model):
    """Haztrak Organization"""

    objects = OrgManager()

    class Meta:
        verbose_name = "Organization"
        verbose_name_plural = "Organizations"
        ordering = ["name"]
        indexes = [models.Index(fields=["slug"], name="org_slug_idx")]

    id = models.UUIDField(
        unique=True,
        editable=False,
        primary_key=True,
        default=uuid.uuid4,
    )
    slug = AutoSlugField(
        populate_from="name",
        max_length=50,
        null=False,
    )
    name = models.CharField(
        max_length=200,
        unique=True,
        null=False,
        blank=False,
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


class OrgUserObjectPermission(UserObjectPermissionBase):
    """Org object level permission."""

    class Meta(UserObjectPermissionBase.Meta):
        verbose_name = "Org Permission"
        verbose_name_plural = "Org Permissions"

    # Note: class attribute must be named content_object (see django-guardian docs)
    content_object = models.ForeignKey(Org, on_delete=models.CASCADE, db_column="org_object_id")


class OrgGroupObjectPermission(GroupObjectPermissionBase):
    """Org object level Group."""

    class Meta(GroupObjectPermissionBase.Meta):
        verbose_name = "Org Role"
        verbose_name_plural = "Org Roles"

    content_object = models.ForeignKey(Org, on_delete=models.CASCADE, db_column="org_object_id")


class SiteManager(QuerySet):
    """Query interface for the Site model"""

    def filter_by_username(self: models.Manager, username: str) -> QuerySet:
        """filter a list of sites a user has access to (by username)"""
        return get_objects_for_user(
            TrakUser.objects.get(username=username),
            "view_site",
            self.model,
            accept_global_perms=False,
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
        return get_objects_for_user(user, "view_site", self.model, accept_global_perms=False)

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
    """The site entity represents a physical location that is a part of an organization."""

    objects = SiteManager.as_manager()

    class Meta:
        verbose_name = "Site"
        verbose_name_plural = "Sites"
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
        Org,
        on_delete=models.CASCADE,
    )

    @property
    def admin_has_rcrainfo_api_credentials(self) -> bool:
        """Returns True if the admin user has RcraInfo API credentials"""
        return self.org.is_rcrainfo_integrated

    def __str__(self):
        """Used in StringRelated fields in serializer classes"""
        return f"{self.rcra_site.epa_id}"


class SiteUserObjectPermission(UserObjectPermissionBase):
    """Site object level permission."""

    class Meta(UserObjectPermissionBase.Meta):
        verbose_name = "Site Permission"
        verbose_name_plural = "Site Permissions"

    content_object = models.ForeignKey(Site, on_delete=models.CASCADE, db_column="site_object_id")


class SiteGroupObjectPermission(GroupObjectPermissionBase):
    """Site object level Group."""

    class Meta(GroupObjectPermissionBase.Meta):
        verbose_name = "Site Role"
        verbose_name_plural = "Site Roles"

    content_object = models.ForeignKey(Site, on_delete=models.CASCADE, db_column="site_object_id")
