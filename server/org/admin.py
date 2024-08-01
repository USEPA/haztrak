from django.contrib import admin
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from guardian.admin import GuardedModelAdmin

from org.models import (
    Org,
    OrgGroupObjectPermission,
    OrgUserObjectPermission,
    Site,
    SiteGroupObjectPermission,
    SiteUserObjectPermission,
)


@admin.register(Org)
class HaztrakOrgAdmin(admin.ModelAdmin):
    list_display = ["__str__", "number_of_sites"]
    readonly_fields = ["rcrainfo_integrated", "slug"]

    def rcrainfo_integrated(self, obj):
        return obj.is_rcrainfo_integrated

    rcrainfo_integrated.boolean = True
    rcrainfo_integrated.short_description = "Admin has setup RCRAInfo integration"

    @staticmethod
    def number_of_sites(org: Org):
        return Site.objects.filter(org=org).count()


@admin.register(Site)
class HaztrakSiteAdmin(admin.ModelAdmin):
    list_display = ["__str__", "last_rcrainfo_manifest_sync"]
    search_fields = ["rcra_site__epa_id"]


class BasePermissionAdmin(GuardedModelAdmin):
    _my_model_name = None

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "permission":
            content_type = ContentType.objects.get_for_model(self._my_model_name)
            kwargs["queryset"] = Permission.objects.filter(content_type=content_type)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class SitePermissionAdmin(BasePermissionAdmin):
    _my_model_name = Site


class OrgPermissionAdmin(BasePermissionAdmin):
    _my_model_name = Org


admin.site.register(SiteUserObjectPermission, SitePermissionAdmin)
admin.site.register(SiteGroupObjectPermission, SitePermissionAdmin)
admin.site.register(OrgGroupObjectPermission, OrgPermissionAdmin)
admin.site.register(OrgUserObjectPermission, OrgPermissionAdmin)
