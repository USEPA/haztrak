from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import HaztrakUser


class HiddenListView(admin.ModelAdmin):
    """
    For instances where we want the Admin to be able to edit/add/delete in place model instances
    for models used by this ModelAdmin,
    but having a list view offer's not and just clutters the admin side navigation
    """

    def has_module_permission(self, request):
        return False


admin.site.register(HaztrakUser, UserAdmin)

try:
    from rest_framework.authtoken.models import TokenProxy as DRFToken
except ImportError:
    from rest_framework.authtoken.models import Token as DRFToken

admin.site.unregister(DRFToken)
