from django.contrib import admin
from django.db.models import Q, QuerySet
from django.urls import reverse
from django.utils.html import format_html, urlencode

from .models import (
    Address,
    Contact,
    EpaPhone,
    ESignature,
    Handler,
    Manifest,
    ManifestHandler,
    RcraProfile,
    Signer,
    Site,
    SitePermission,
    Transporter,
    WasteCode,
    WasteLine,
)


@admin.register(RcraProfile)
class RcraProfileAdmin(admin.ModelAdmin):
    list_display = ["__str__", "related_user", "rcra_username", "api_user"]

    def related_user(self, user):
        url = reverse("admin:auth_user_changelist") + "?" + urlencode({"q": str(user.id)})
        return format_html("<a href='{}'>{}</a>", url, user)

    def api_user(self, profile: RcraProfile) -> bool:
        return profile.is_api_user

    api_user.boolean = True
    api_user.short_description = "Rcrainfo API User"
    related_user.short_description = "User"


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ["__str__", "state", "country"]
    list_filter = ["state", "country"]


@admin.register(SitePermission)
class SitePermissionAdmin(admin.ModelAdmin):
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


@admin.register(Transporter)
class TransporterAdmin(admin.ModelAdmin):
    list_display = ["__str__", "related_manifest", "order"]
    search_fields = ["handler__epa_id", "manifest__mtn"]

    def related_manifest(self, obj):
        url = (
            reverse("admin:trak_manifest_changelist")
            + "?"
            + urlencode({"mtn": str(obj.manifest.mtn)})
        )
        return format_html("<a href='{}'>{}</a>", url, obj.manifest.mtn)

    related_manifest.short_description = "Manifest"


@admin.register(ManifestHandler)
class ManifestHandlerAdmin(admin.ModelAdmin):
    list_display = ["__str__", "related_manifest"]

    def related_manifest(self, obj: ManifestHandler):
        if obj.generator:
            return obj.generator.get()
        if obj.designated_facility:
            return obj.designated_facility.get()
        # return obj.manifest.__str__() if obj.manifest else None

    related_manifest.short_description = "Manifest"


class IsDraftMtn(admin.SimpleListFilter):
    title = "Draft Manifest"
    parameter_name = "is_draft"

    def lookups(self, request, model_admin):
        return ("True", True), ("False", False)

    def queryset(self, request, queryset: QuerySet):
        if self.value() == "True":
            return queryset.filter(mtn__iendswith="DFT")
        elif self.value() == "False":
            return queryset.filter(~Q(mtn__iendswith="DFT"))
        else:
            return queryset


@admin.register(Manifest)
class ManifestAdmin(admin.ModelAdmin):
    list_display = ["mtn", "generator", "tsd", "status", "transporter_count"]
    list_filter = [IsDraftMtn, "status"]
    search_fields = ["mtn__icontains"]

    def transporter_count(self, manifest):
        # ToDo: this will result in additional DB hit for every Manifest in the list rendered.
        return Transporter.objects.filter(manifest=manifest).count()


@admin.register(WasteCode)
class WasteCodeAdmin(admin.ModelAdmin):
    list_display = ["__str__", "abbreviated_description", "code_type"]
    list_filter = ["code_type"]
    search_fields = ["code", "description"]

    def abbreviated_description(self, waste_code: WasteCode):
        if len(waste_code.description) > 35:
            return f"{waste_code.description[:32]}..."
        else:
            return f"{waste_code.description}"


@admin.register(Handler)
class HandlerAdmin(admin.ModelAdmin):
    list_display = ["__str__", "site_type", "site_address", "mail_address"]
    list_filter = ["site_type"]


@admin.register(Site)
class SiteAdmin(admin.ModelAdmin):
    list_display = ["__str__", "related_handler", "last_rcra_sync"]
    list_display_links = ["__str__", "related_handler"]

    def related_handler(self, site: Site) -> str:
        url = (
            reverse("admin:trak_handler_changelist")
            + "?"
            + urlencode({"epa_id": str(site.epa_site.epa_id)})
        )
        return format_html("<a href='{}'>{}</a>", url, site.epa_site.epa_id)


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ["__str__", "email", "company_name"]
    search_fields = ["first_name", "last_name", "company_name"]


@admin.register(WasteLine)
class WasteLineAdmin(admin.ModelAdmin):
    list_display = ["__str__", "epa_waste", "dot_hazardous"]
    list_filter = ["epa_waste", "dot_hazardous"]
    search_fields = ["manifest__mtn"]


class HiddenListView(admin.ModelAdmin):
    """
    For instances where we want the Admin to be able to edit/add/delete in place model instances
    for models used by this ModelAdmin,
    but having a list view offer's not and just clutters the admin side navigation
    """

    def has_module_permission(self, request):
        return False


# Register models That should only be edited within the
# context of another form here.
admin.site.register(EpaPhone, HiddenListView)
admin.site.register(ESignature, HiddenListView)
admin.site.register(Signer, HiddenListView)
