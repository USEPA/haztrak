"""Signals for the core app."""

from profile.models import RcrainfoProfile

from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    """Create a profile when a user is created."""
    if created:
        RcrainfoProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    """Save the profile when the user is saved."""
    instance.profile.save()
