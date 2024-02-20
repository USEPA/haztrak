"""business logic related to a user's Haztrak profile (note: not their RcrainfoProfile)"""
from django.db import transaction

from apps.core.models import TrakUser
from apps.profile.models import TrakProfile


@transaction.atomic
def get_or_create_profile(*, username: str) -> tuple[TrakProfile, bool]:
    """Retrieve a user's HaztrakProfile"""
    user = TrakUser.objects.get(username=username)
    profile, created = TrakProfile.objects.get_or_create(user=user)
    if created:
        profile.user = TrakUser.objects.get(username=username)
        profile.save()
    return profile, created
