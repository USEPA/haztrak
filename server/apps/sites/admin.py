from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html, urlencode

from apps.core.admin import HiddenListView
from apps.sites.models import Address, Contact, RcraProfile, RcraSite, RcraSitePermission, Site


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


@admin.register(RcraProfile)
class RcraProfileAdmin(admin.ModelAdmin):
    list_display = ["__str__", "related_user", "rcra_username", "api_user"]
    search_fields = ["user__username", "rcra_username"]

    def related_user(self, user):
        url = reverse("admin:auth_user_changelist") + "?" + urlencode({"q": str(user.id)})
        return format_html("<a href='{}'>{}</a>", url, user)

    def api_user(self, profile: RcraProfile) -> bool:
        return profile.is_api_user

    api_user.boolean = True
    api_user.short_description = "Rcrainfo API User"
    related_user.short_description = "User"


@admin.register(RcraSitePermission)
class RcraSitePermissionAdmin(admin.ModelAdmin):
    list_display = [
        "__str__",
        "site_manager",
        "biennial_report",
        "annual_report",
        "e_manifest",
        "wiets",
        "my_rcra_id",
    ]
    list_filter = ["site_manager"]
    search_fields = ["profile__user__username", "site__rcra_site__epa_id"]


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ["__str__", "state", "country"]
    list_filter = ["state", "country"]


# Register models That should only be edited within the context of another form here.
admin.site.register(Contact, HiddenListView)
