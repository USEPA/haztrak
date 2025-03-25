"""Manifest admin."""

from core.admin import HiddenListView
from django.contrib import admin
from django.db.models import Q, QuerySet
from django.urls import reverse
from django.utils.html import format_html, urlencode
from manifest.models import Manifest
from wasteline.admin import WasteLineInline

from .models import (
    ESignature,
    Handler,
    ManifestPhone,
    Signer,
    Transporter,
)


class IsDraftMtn(admin.SimpleListFilter):
    """Filter for draft manifests."""

    title = "Draft Manifest"
    parameter_name = "is_draft"

    def lookups(self, request, model_admin):
        """Lookups."""
        return ("True", True), ("False", False)

    def queryset(self, request, queryset: QuerySet):
        """Queryset."""
        if self.value() == "True":
            return queryset.filter(mtn__iendswith="DFT")
        if self.value() == "False":
            return queryset.filter(~Q(mtn__iendswith="DFT"))
        return queryset


@admin.register(Manifest)
class ManifestAdmin(admin.ModelAdmin):
    """Manifest Admin view."""

    list_display = ["mtn", "generator", "tsdf", "status", "transporter_count"]
    list_filter = [IsDraftMtn, "status"]
    search_fields = ["mtn__icontains", "generator__handler__epa_id", "tsdf__handler__epa_id"]
    inlines = [WasteLineInline]

    @admin.display(description="Transporters")
    def transporter_count(self, manifest):
        """Transporter count."""
        # TODO(David): result in additional DB hit for every Manifest in the list rendered.
        return Transporter.objects.filter(manifest=manifest).count()


class IsApiUser(admin.SimpleListFilter):
    """Filter for API Users."""

    title = "API User"
    parameter_name = "has_rcrainfo_api_id_key"

    def lookups(self, request, model_admin):
        """Lookups."""
        return ("True", True), ("False", False)

    def queryset(self, request, queryset: QuerySet):
        """Queryset."""
        if self.value() == "True":
            return queryset.filter(mtn__iendswith="DFT")
        if self.value() == "False":
            return queryset.filter(~Q(mtn__iendswith="DFT"))
        return queryset


@admin.register(Transporter)
class TransporterAdmin(admin.ModelAdmin):
    """Transporter Admin."""

    list_display = ["__str__", "related_manifest", "order"]
    search_fields = ["handler__epa_id", "manifest__mtn"]

    def related_manifest(self, obj):
        """Related manifest."""
        url = (
            reverse("admin:trak_manifest_changelist")
            + "?"
            + urlencode({"mtn": str(obj.manifest.mtn)})
        )
        return format_html("<a href='{}'>{}</a>", url, obj.manifest.mtn)

    related_manifest.short_description = "Manifest"


@admin.register(Handler)
class HandlerAdmin(admin.ModelAdmin):
    """Handler Admin."""

    list_display = ["__str__", "related_manifest"]
    search_fields = ["handler__epa_id"]

    def related_manifest(self, obj: Handler):
        """Related manifest."""
        if obj.generator:
            return obj.generator.get()
        if obj.designated_facility:
            return obj.designated_facility.get()
        return None

    related_manifest.short_description = "Manifest"


# Register models That should only be edited within the context of another form here.
admin.site.register(ManifestPhone, HiddenListView)
admin.site.register(ESignature, HiddenListView)
admin.site.register(Signer, HiddenListView)
