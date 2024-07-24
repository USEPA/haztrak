from django.contrib import admin

from wasteline.models import DotLookup, WasteCode, WasteLine


@admin.register(DotLookup)
class DotOptionsAdmin(admin.ModelAdmin):
    list_display = ["__str__"]
    list_filter = ["value_type"]
    search_fields = ["value"]


@admin.register(WasteLine)
class WasteLineAdmin(admin.ModelAdmin):
    list_display = ["__str__", "epa_waste", "dot_hazardous"]
    list_filter = ["epa_waste", "dot_hazardous"]
    search_fields = ["manifest__mtn"]


@admin.register(WasteCode)
class WasteCodeAdmin(admin.ModelAdmin):
    list_display = ["__str__", "abbreviated_description", "code_type"]
    list_filter = ["code_type"]
    search_fields = ["code", "description"]

    @admin.display(description="Description")
    def abbreviated_description(self, waste_code: WasteCode):
        if len(waste_code.description) > 35:
            return f"{waste_code.description[:32]}..."
        else:
            return f"{waste_code.description}"


class WasteLineInline(admin.TabularInline):
    model = WasteLine
    extra = 0
    min_num = 1
