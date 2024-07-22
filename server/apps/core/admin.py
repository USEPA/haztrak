from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.urls import reverse
from django.utils.html import format_html, urlencode

from apps.profile.models import Profile, RcrainfoProfile, RcrainfoSiteAccess

from .models import GroupPermission, TrakUser, UserPermission


class HiddenListView(admin.ModelAdmin):
    """
    For instances where we want the Admin to be able to edit/add/delete in place model instances
    for models used by this ModelAdmin,
    but having a list view offer's not and just clutters the admin side navigation
    """

    def has_module_permission(self, request):
        return False


@admin.register(TrakUser)
class TrakUserAdmin(UserAdmin):
    list_display = ["username", "related_profile", "email", "is_staff", "is_superuser"]

    @admin.display(description="Profile")
    def related_profile(self, user: TrakUser) -> str:
        url = (
            reverse("admin:core_haztrakprofile_changelist") + "?" + urlencode({"user": str(user)})  # noqa E501
        )
        return format_html("<a href='{}'>{}</a>", url, user.haztrak_profile)


class RcraSitePermissionInline(admin.TabularInline):
    model = RcrainfoSiteAccess
    extra = 0

    ordering = ["site"]

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(RcrainfoProfile)
class RcraProfileAdmin(admin.ModelAdmin):
    list_display = ["__str__", "related_user", "rcra_username", "api_user"]
    search_fields = ["haztrak_profile__user__username", "rcra_username"]
    inlines = [RcraSitePermissionInline]

    def get_model_perms(self, request):
        """Hide from the Side Navigation"""
        return {}

    def related_user(self, user):
        url = reverse("admin:core_haztrakuser_changelist") + "?" + urlencode({"q": str(user.id)})
        return format_html("<a href='{}'>{}</a>", url, user)

    def api_user(self, profile: RcrainfoProfile) -> bool:
        return profile.has_rcrainfo_api_id_key

    api_user.boolean = True
    api_user.short_description = "Rcrainfo API User"
    related_user.short_description = "User"


try:
    from rest_framework.authtoken.models import TokenProxy as DRFToken
except ImportError:
    from rest_framework.authtoken.models import Token as DRFToken

admin.site.register(Profile)
admin.site.unregister(DRFToken)
admin.site.register(UserPermission)
admin.site.register(GroupPermission)
