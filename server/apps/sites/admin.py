from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html, urlencode

from apps.core.admin import HiddenListView
from apps.sites.models import (
    Address,
    Contact,
    HaztrakSite,
    RcraSite,
)
from apps.sites.models.site_models import HaztrakOrg


@admin.register(RcraSite)
class HandlerAdmin(admin.ModelAdmin):
    list_display = ["__str__", "site_type", "site_address", "mail_address"]
    list_filter = ["site_type"]
    search_fields = ["epa_id"]


@admin.register(HaztrakSite)
class HaztrakSiteAdmin(admin.ModelAdmin):
    list_display = ["__str__", "related_handler", "last_rcrainfo_manifest_sync"]
    list_display_links = ["__str__", "related_handler"]

    @admin.display(description="EPA Site")
    def related_handler(self, site: HaztrakSite) -> str:
        url = (
            reverse("admin:sites_rcrasite_changelist")
            + "?"
            + urlencode({"epa_id": str(site.rcra_site.epa_id)})
        )
        return format_html("<a href='{}'>{}</a>", url, site.rcra_site.epa_id)


class HaztrakSiteInline(admin.TabularInline):
    model = HaztrakSite
    extra = 0

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(HaztrakOrg)
class HaztrakOrgAdmin(admin.ModelAdmin):
    list_display = ["__str__", "number_of_sites"]
    inlines = [HaztrakSiteInline]
    readonly_fields = ["rcrainfo_integrated"]

    def rcrainfo_integrated(self, obj):
        return obj.is_rcrainfo_integrated

    rcrainfo_integrated.boolean = True
    rcrainfo_integrated.short_description = "Admin has setup RCRAInfo integration"

    def number_of_sites(self, org: HaztrakOrg):
        return HaztrakSite.objects.filter(org=org).count()


# Register models That should only be edited within the context of another form here.
admin.site.register(Contact, HiddenListView)
admin.site.register(Address, HiddenListView)
