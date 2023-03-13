from abc import ABCMeta, abstractmethod

from django.db import models


class TrakManager(models.Manager, metaclass=ABCMeta):
    """
    Abstract class that defines an interface for our model managers
    """

    @abstractmethod
    def save(self, **kwargs) -> models.QuerySet:
        """Save instance and its related models to the database"""
        return self.create(**kwargs)
