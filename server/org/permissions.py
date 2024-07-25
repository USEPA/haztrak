from rest_framework.permissions import DjangoObjectPermissions


class SiteObjectPermissions(DjangoObjectPermissions):
    """Object level permission for Site model."""

    perms_map = {
        **DjangoObjectPermissions.perms_map,
        "GET": ["%(app_label)s.view_%(model_name)s"],
        "OPTIONS": ["%(app_label)s.view_%(model_name)s"],
        "HEAD": ["%(app_label)s.view_%(model_name)s"],
    }
