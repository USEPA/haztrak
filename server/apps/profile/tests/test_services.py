from apps.profile.services import get_user_profile, get_user_rcrainfo_profile


class TestTrakProfileServices:
    def test_get_user_profile(self, profile_factory, user_factory):
        user = user_factory()
        saved_profile = profile_factory(user=user)
        profile = get_user_profile(user=user)
        assert profile == saved_profile


class TestRcrainfoProfileServices:
    def test_getting_a_user_rcrainfo_profile(self, rcrainfo_profile_factory, profile_factory):
        rcrainfo_profile = rcrainfo_profile_factory()
        trak_profile = profile_factory(rcrainfo_profile=rcrainfo_profile)
        returned_profile = get_user_rcrainfo_profile(user=trak_profile.user)
        assert returned_profile == rcrainfo_profile
