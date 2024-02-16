from apps.org.serializers import HaztrakOrgSerializer


class TestHaztrakOrgSerializer:
    def test_rcrainfo_integrated_is_true(
        self, haztrak_org_factory, haztrak_profile_factory, rcra_profile_factory, user_factory
    ):
        admin = user_factory()
        rcra_profile = rcra_profile_factory(
            rcra_api_id="exists",
            rcra_api_key="exists",
        )
        haztrak_profile_factory(user=admin, rcrainfo_profile=rcra_profile)
        org = haztrak_org_factory(admin=admin)
        serializer = HaztrakOrgSerializer(org)
        assert serializer.data["rcrainfoIntegrated"] is True

    def test_rcrainfo_integrated_is_false(
        self, haztrak_org_factory, haztrak_profile_factory, rcra_profile_factory, user_factory
    ):
        admin = user_factory()
        rcra_profile = rcra_profile_factory(
            rcra_api_id=None,
            rcra_api_key=None,
        )
        haztrak_profile_factory(user=admin, rcrainfo_profile=rcra_profile)
        org = haztrak_org_factory(admin=admin)
        serializer = HaztrakOrgSerializer(org)
        assert serializer.data["rcrainfoIntegrated"] is False
