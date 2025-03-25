"""Admin for wasteline app."""

from django.contrib import admin

from wasteline.models import DotLookup, WasteCode, WasteLine


@admin.register(DotLookup)
class DotOptionsAdmin(admin.ModelAdmin):
    """Admin for DotLookup model."""

    list_display = ["__str__"]
    list_filter = ["value_type"]
    search_fields = ["value"]


@admin.register(WasteLine)
class WasteLineAdmin(admin.ModelAdmin):
    """Admin for WasteLine model."""

    list_display = ["__str__", "epa_waste", "dot_hazardous"]
    list_filter = ["epa_waste", "dot_hazardous"]
    search_fields = ["manifest__mtn"]


@admin.register(WasteCode)
class WasteCodeAdmin(admin.ModelAdmin):
    """Admin for WasteCode model."""

    list_display = ["__str__", "abbreviated_description", "code_type"]
    list_filter = ["code_type"]
    search_fields = ["code", "description"]

    @admin.display(description="Description")
    def abbreviated_description(self, waste_code: WasteCode):
        """Shorten the description."""
        short_description_length = 35
        if len(waste_code.description) > short_description_length:
            return f"{waste_code.description[:32]}..."
        return f"{waste_code.description}"


class WasteLineInline(admin.TabularInline):
    """Inline for WasteLine model."""

    model = WasteLine
    extra = 0
    min_num = 1
