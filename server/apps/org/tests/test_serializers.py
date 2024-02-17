from apps.org.serializers import TrakOrgSerializer


class TestTrakOrgSerializer:
    def test_rcrainfo_integrated_is_true(
        self, org_factory, profile_factory, rcrainfo_profile_factory, user_factory
    ):
        admin = user_factory()
        rcra_profile = rcrainfo_profile_factory(
            rcra_api_id="exists",
            rcra_api_key="exists",
        )
        profile_factory(user=admin, rcrainfo_profile=rcra_profile)
        org = org_factory(admin=admin)
        serializer = TrakOrgSerializer(org)
        assert serializer.data["rcrainfoIntegrated"] is True

    def test_rcrainfo_integrated_is_false(
        self, org_factory, profile_factory, rcrainfo_profile_factory, user_factory
    ):
        admin = user_factory()
        rcra_profile = rcrainfo_profile_factory(
            rcra_api_id=None,
            rcra_api_key=None,
        )
        profile_factory(user=admin, rcrainfo_profile=rcra_profile)
        org = org_factory(admin=admin)
        serializer = TrakOrgSerializer(org)
        assert serializer.data["rcrainfoIntegrated"] is False
