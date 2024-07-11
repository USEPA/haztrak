import uuid

from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import Permission as DjangoPermission
from django.db import models


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


class Permission(DjangoPermission):
    """Haztrak proxy permission model used for our custom object level permissions."""

    class Meta:
        proxy = True
        verbose_name = "Permission"
        verbose_name_plural = "Permissions"
        ordering = ["name"]

    @property
    def app_label(self):
        return self.content_type.app_label

    @property
    def model_name(self):
        return self.content_type.model

    def __str__(self):
        return f"{self.content_type.name} | {self.name}"
