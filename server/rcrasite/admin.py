from django.contrib import admin

from core.admin import HiddenListView
from rcrasite.models import (
    Address,
    Contact,
    RcraSite,
)


@admin.register(RcraSite)
class RcraSiteAdmin(admin.ModelAdmin):
    list_display = ["__str__", "site_type", "site_address", "mail_address"]
    list_filter = ["site_type"]
    search_fields = ["epa_id"]


# Register models That should only be edited within the context of another form here.
admin.site.register(Contact, HiddenListView)
admin.site.register(Address, HiddenListView)
