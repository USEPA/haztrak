from django.contrib import admin

from apps.org.models import HaztrakOrg
from apps.profile.models import HaztrakProfile
from apps.rcrasite.admin import HaztrakSiteInline
from apps.site.models import HaztrakSite


class HaztrakProfileInline(admin.TabularInline):
    model = HaztrakProfile
    extra = 0


@admin.register(HaztrakOrg)
class HaztrakOrgAdmin(admin.ModelAdmin):
    list_display = ["__str__", "number_of_sites"]
    inlines = [HaztrakSiteInline, HaztrakProfileInline]
    readonly_fields = ["rcrainfo_integrated"]

    def rcrainfo_integrated(self, obj):
        return obj.is_rcrainfo_integrated

    rcrainfo_integrated.boolean = True
    rcrainfo_integrated.short_description = "Admin has setup RCRAInfo integration"

    def number_of_sites(self, org: HaztrakOrg):
        return HaztrakSite.objects.filter(org=org).count()
