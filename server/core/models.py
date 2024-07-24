import uuid

from django.contrib.auth.models import AbstractUser, Group
from django.contrib.auth.models import Permission as DjangoPermission
from django.db import models
from guardian.models import GroupObjectPermissionAbstract, UserObjectPermissionAbstract


class TrakUser(AbstractUser):
    """Haztrak abstract user model. It simply inherits from Django's AbstractUser model."""

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["username"]

    id = models.UUIDField(
        primary_key=True,
        editable=False,
        default=uuid.uuid4,
    )


class UserPermission(UserObjectPermissionAbstract):
    """
    User object permission model for Haztrak.
    access via guardian.utils.get_user_obj_perms_model()
    We define this class if we need to customize User object level permissions later.
    """

    class Meta(UserObjectPermissionAbstract.Meta):
        abstract = False


class GroupPermission(GroupObjectPermissionAbstract):
    """
    Group object permission model for Haztrak.
    access via guardian.utils get_group_obj_perms_model()
    We define this class if we need to customize Group object level permissions later.
    """

    class Meta(GroupObjectPermissionAbstract.Meta):
        abstract = False
