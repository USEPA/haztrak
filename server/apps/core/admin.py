from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.urls import reverse
from django.utils.html import format_html, urlencode

from .models import HaztrakProfile, HaztrakUser


class HiddenListView(admin.ModelAdmin):
    """
    For instances where we want the Admin to be able to edit/add/delete in place model instances
    for models used by this ModelAdmin,
    but having a list view offer's not and just clutters the admin side navigation
    """

    def has_module_permission(self, request):
        return False


admin.site.register(HaztrakProfile)


@admin.register(HaztrakUser)
class HaztrakUserAdmin(UserAdmin):
    list_display = ["username", "related_profile", "email", "is_staff", "is_superuser"]

    @admin.display(description="Profile")
    def related_profile(self, user: HaztrakUser) -> str:
        url = (
            reverse("admin:core_haztrakprofile_changelist") + "?" + urlencode({"user": str(user)})
        )
        return format_html("<a href='{}'>{}</a>", url, user.haztrak_profile)


try:
    from rest_framework.authtoken.models import TokenProxy as DRFToken
except ImportError:
    from rest_framework.authtoken.models import Token as DRFToken

admin.site.unregister(DRFToken)
