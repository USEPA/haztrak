"""Core models."""

import uuid

from django.contrib.auth.models import AbstractUser, Group
from django.contrib.auth.models import Permission as DjangoPermission
from django.db import models
from guardian.mixins import GuardianUserMixin
from guardian.models import GroupObjectPermissionAbstract, UserObjectPermissionAbstract


class TrakUser(GuardianUserMixin, AbstractUser):
    """Haztrak abstract user model. It simply inherits from Django's AbstractUser model."""

    class Meta:
        """Metaclass."""

        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["username"]

    id = models.UUIDField(
        primary_key=True,
        editable=False,
        default=uuid.uuid4,
    )

    def has_perm(self, perm, obj=None):
        """Check if user has permission."""
        return super().has_perm(perm, obj)
