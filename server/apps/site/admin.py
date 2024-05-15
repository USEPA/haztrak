from django.contrib import admin

from apps.site.models import Site


@admin.register(Site)
class HaztrakSiteAdmin(admin.ModelAdmin):
    list_display = ["__str__", "last_rcrainfo_manifest_sync"]
    readonly_fields = ["rcra_site"]
    search_fields = ["rcra_site__epa_id"]
