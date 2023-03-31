from abc import ABCMeta, abstractmethod

from django.db import models


class TrakBaseManager(models.Manager, metaclass=ABCMeta):
    """
    Abstract class that defines an interface for our model managers
    """

    def __repr__(self):
        field_values = ", ".join(
            f"{field.name}={getattr(self, field.name)!r}" for field in self._meta.fields
        )
        return f"<{self.__class__.__name__}({field_values})>"

    @abstractmethod
    def save(self, **kwargs) -> models.QuerySet:
        """Save instance and its related models to the database"""
        return self.create(**kwargs)


class TrakBaseModel(models.Model):
    """Base class for all apps.trak models"""

    class Meta:
        abstract = True
        ordering = ["pk"]

    def __str__(self):
        return f"{self.__class__.__name__}"

    def __repr__(self):
        field_values = ", ".join(
            f"{field.name}={getattr(self, field.name)!r}" for field in self._meta.fields
        )
        return f"<{self.__class__.__name__}({field_values})>"
