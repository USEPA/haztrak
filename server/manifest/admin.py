from django.contrib import admin
from django.db.models import Q, QuerySet

from handler.models import Transporter
from manifest.models import Manifest
from wasteline.admin import WasteLineInline


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
    list_display = ["mtn", "generator", "tsdf", "status", "transporter_count"]
    list_filter = [IsDraftMtn, "status"]
    search_fields = ["mtn__icontains", "generator__handler__epa_id", "tsdf__handler__epa_id"]
    inlines = [WasteLineInline]

    @admin.display(description="Transporters")
    def transporter_count(self, manifest):
        # ToDo: this will result in additional DB hit for every Manifest in the list rendered.
        return Transporter.objects.filter(manifest=manifest).count()
