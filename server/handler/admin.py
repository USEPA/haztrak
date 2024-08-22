from core.admin import HiddenListView
from django.contrib import admin
from django.db.models import Q, QuerySet
from django.urls import reverse
from django.utils.html import format_html, urlencode
from manifest.models import (
    ESignature,
    Handler,
    ManifestPhone,
    Signer,
    Transporter,
)


class IsApiUser(admin.SimpleListFilter):
    title = "API User"
    parameter_name = "has_rcrainfo_api_id_key"

    def lookups(self, request, model_admin):
        return ("True", True), ("False", False)

    def queryset(self, request, queryset: QuerySet):
        if self.value() == "True":
            return queryset.filter(mtn__iendswith="DFT")
        elif self.value() == "False":
            return queryset.filter(~Q(mtn__iendswith="DFT"))
        else:
            return queryset


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


@admin.register(Handler)
class HandlerAdmin(admin.ModelAdmin):
    list_display = ["__str__", "related_manifest"]
    search_fields = ["handler__epa_id"]

    def related_manifest(self, obj: Handler):
        if obj.generator:
            return obj.generator.get()
        if obj.designated_facility:
            return obj.designated_facility.get()

    related_manifest.short_description = "Manifest"


# Register models That should only be edited within the context of another form here.
admin.site.register(ManifestPhone, HiddenListView)
admin.site.register(ESignature, HiddenListView)
admin.site.register(Signer, HiddenListView)
