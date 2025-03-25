"""Guardian object level permission filter backend."""

from guardian.shortcuts import get_objects_for_user
from rest_framework.filters import BaseFilterBackend


class ObjectPermissionsFilter(BaseFilterBackend):
    """Object level permission filter backend.

    A filter backend that limits results to those where the requesting user
    has read object level permissions.
    """

    perm_format = "%(app_label)s.view_%(model_name)s"
    shortcut_kwargs = {
        "accept_global_perms": False,
    }

    def filter_queryset(self, request, queryset, view):
        """Filter the queryset."""
        user = request.user
        permission = self.perm_format % {
            "app_label": queryset.model._meta.app_label,  # noqa: SLF001
            "model_name": queryset.model._meta.model_name,  # noqa: SLF001
        }

        return get_objects_for_user(user, permission, queryset, **self.shortcut_kwargs)
