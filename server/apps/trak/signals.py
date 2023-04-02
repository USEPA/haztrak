from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.sites.models.epa_profile_models import EpaProfile


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        EpaProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()
