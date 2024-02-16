"""business logic related to a user's Haztrak profile (note: not their RcrainfoProfile)"""
from django.db import transaction

from apps.core.models import HaztrakUser
from apps.profile.models import HaztrakProfile


@transaction.atomic
def get_or_create_haztrak_profile(*, username: str) -> tuple[HaztrakProfile, bool]:
    """Retrieve a user's HaztrakProfile"""
    user = HaztrakUser.objects.get(username=username)
    profile, created = HaztrakProfile.objects.get_or_create(user=user)
    if created:
        profile.user = HaztrakUser.objects.get(username=username)
        profile.save()
    return profile, created
