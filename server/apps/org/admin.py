from django.contrib import admin

from apps.org.models import TrakOrg, TrakOrgAccess
from apps.site.models import TrakSite

admin.site.register(TrakOrgAccess)


@admin.register(TrakOrg)
class HaztrakOrgAdmin(admin.ModelAdmin):
    list_display = ["__str__", "number_of_sites"]
    # inlines = [HaztrakSiteInline, HaztrakProfileInline]
    readonly_fields = ["rcrainfo_integrated"]

    def rcrainfo_integrated(self, obj):
        return obj.is_rcrainfo_integrated

    rcrainfo_integrated.boolean = True
    rcrainfo_integrated.short_description = "Admin has setup RCRAInfo integration"

    def number_of_sites(self, org: TrakOrg):
        return TrakSite.objects.filter(org=org).count()
