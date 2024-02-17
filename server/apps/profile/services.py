"""business logic related to a user's Haztrak profile (note: not their RcrainfoProfile)"""
from django.conf import settings
from django.db import transaction

from apps.core.models import TrakUser
from apps.profile.models import RcrainfoProfile, TrakProfile


@transaction.atomic
def get_or_create_profile(*, username: str) -> tuple[TrakProfile, bool]:
    """Retrieve a user's HaztrakProfile"""
    user = TrakUser.objects.get(username=username)
    profile, created = TrakProfile.objects.get_or_create(user=user)
    if created:
        profile.user = TrakUser.objects.get(username=username)
        profile.save()
    return profile, created


def get_user_profile(*, user: settings.AUTH_USER_MODEL) -> TrakProfile:
    """Retrieve a user's Profile"""
    return TrakProfile.objects.get_profile_by_user(user=user)


def get_user_rcrainfo_profile(*, user: settings.AUTH_USER_MODEL) -> RcrainfoProfile:
    """Retrieve a user's locally stored RCRAInfo Profile"""
    return RcrainfoProfile.objects.get_by_trak_username(user.username)
