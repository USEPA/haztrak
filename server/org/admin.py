from django.contrib import admin
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from guardian.admin import GuardedModelAdmin

from apps.site.models import Site
from org.models import Org, OrgAccess, OrgGroupObjectPermission, OrgUserObjectPermission

admin.site.register(OrgAccess)


@admin.register(Org)
class HaztrakOrgAdmin(admin.ModelAdmin):
    list_display = ["__str__", "number_of_sites"]
    readonly_fields = ["rcrainfo_integrated"]

    def rcrainfo_integrated(self, obj):
        return obj.is_rcrainfo_integrated

    rcrainfo_integrated.boolean = True
    rcrainfo_integrated.short_description = "Admin has setup RCRAInfo integration"

    def number_of_sites(self, org: Org):
        return Site.objects.filter(org=org).count()


@admin.register(OrgUserObjectPermission)
class OrgUserObjectPermissionAdmin(GuardedModelAdmin):
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "permission":
            content_type = ContentType.objects.get_for_model(Site)
            kwargs["queryset"] = Permission.objects.filter(content_type=content_type)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(OrgGroupObjectPermission)
class OrgGroupObjectPermissionAdmin(GuardedModelAdmin):
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "permission":
            content_type = ContentType.objects.get_for_model(Site)
            kwargs["queryset"] = Permission.objects.filter(content_type=content_type)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
