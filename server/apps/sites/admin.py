from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html, urlencode

from apps.core.admin import HiddenListView
from apps.core.models import RcraProfile
from apps.sites.models import Address, Contact, RcraSite, RcraSitePermission, Site


@admin.register(RcraSite)
class HandlerAdmin(admin.ModelAdmin):
    list_display = ["__str__", "site_type", "site_address", "mail_address"]
    list_filter = ["site_type"]
    search_fields = ["epa_id"]


@admin.register(Site)
class SiteAdmin(admin.ModelAdmin):
    list_display = ["__str__", "related_handler", "last_rcra_sync"]
    list_display_links = ["__str__", "related_handler"]

    @admin.display(description="EPA Site")
    def related_handler(self, site: Site) -> str:
        url = (
            reverse("admin:sites_epasite_changelist")
            + "?"
            + urlencode({"epa_id": str(site.rcra_site.epa_id)})
        )
        return format_html("<a href='{}'>{}</a>", url, site.rcra_site.epa_id)


class RcraSitePermissionInline(admin.TabularInline):
    model = RcraSitePermission
    extra = 0
    ordering = ["site"]

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(RcraProfile)
class RcraProfileAdmin(admin.ModelAdmin):
    list_display = ["__str__", "related_user", "rcra_username", "api_user"]
    search_fields = ["user__username", "rcra_username"]
    inlines = [RcraSitePermissionInline]

    def related_user(self, user):
        url = reverse("admin:core_haztrakuser_changelist") + "?" + urlencode({"q": str(user.id)})
        return format_html("<a href='{}'>{}</a>", url, user)

    def api_user(self, profile: RcraProfile) -> bool:
        return profile.is_api_user

    api_user.boolean = True
    api_user.short_description = "Rcrainfo API User"
    related_user.short_description = "User"


# Register models That should only be edited within the context of another form here.
admin.site.register(Contact, HiddenListView)
admin.site.register(Address, HiddenListView)
