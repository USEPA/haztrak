from django.contrib import admin
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from guardian.admin import GuardedModelAdmin

from apps.site.models import Site, SiteGroupObjectPermission, SiteUserObjectPermission


@admin.register(Site)
class HaztrakSiteAdmin(admin.ModelAdmin):
    list_display = ["__str__", "last_rcrainfo_manifest_sync"]
    readonly_fields = ["rcra_site"]
    search_fields = ["rcra_site__epa_id"]


@admin.register(SiteUserObjectPermission)
class SiteUserObjectPermissionAdmin(GuardedModelAdmin):
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "permission":
            content_type = ContentType.objects.get_for_model(Site)
            kwargs["queryset"] = Permission.objects.filter(content_type=content_type)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(SiteGroupObjectPermission)
class SiteGroupObjectPermissionAdmin(GuardedModelAdmin):
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "permission":
            content_type = ContentType.objects.get_for_model(Site)
            kwargs["queryset"] = Permission.objects.filter(content_type=content_type)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
