from apps.org.models import Org


class TestOrgModel:
    def test_haztrak_org_factory(self, org_factory):
        org = org_factory()
        assert isinstance(org, Org)

    def test_getting_org_api_credentials(
        self, org_factory, rcrainfo_profile_factory, user_factory, profile_factory
    ):
        # Arrange
        mock_api_id = "03048337-f790-4d18-b579-491d7c1fbb04"
        mock_api_key = "NeSogenKnxTjwwltaMJ"
        admin = user_factory(username="admin")
        rcra_profile = rcrainfo_profile_factory(rcra_api_id=mock_api_id, rcra_api_key=mock_api_key)
        profile_factory(user=admin, rcrainfo_profile=rcra_profile)
        org = org_factory(admin=admin)
        # Act
        api_id, api_key = org.rcrainfo_api_id_key
        # Assert
        assert api_id == mock_api_id
        assert api_key == mock_api_key

    def test_rcrainfo_integrated_false_without_credentials(
        self, org_factory, rcrainfo_profile_factory, user_factory, profile_factory
    ):
        # Arrange
        admin = user_factory(username="admin")
        rcra_profile = rcrainfo_profile_factory(rcra_api_id=None, rcra_api_key=None)
        profile_factory(user=admin, rcrainfo_profile=rcra_profile)
        org = org_factory(admin=admin)
        # Act/Assert
        assert not org.is_rcrainfo_integrated

    def test_rcrainfo_integrated_true_with_credentials(
        self, org_factory, rcrainfo_profile_factory, user_factory, profile_factory
    ):
        # Arrange
        mock_api_id = "03048337-f790-4d18-b579-491d7c1fbb04"
        mock_api_key = "NeSogenKnxTjwwltaMJ"
        admin = user_factory(username="admin")
        rcra_profile = rcrainfo_profile_factory(rcra_api_id=mock_api_id, rcra_api_key=mock_api_key)
        profile_factory(user=admin, rcrainfo_profile=rcra_profile)
        org = org_factory(admin=admin)
        # Act/Assert
        assert org.is_rcrainfo_integrated

    class TestGetUserOrg:
        def test_get_user_org(self, user_factory, org_factory, org_access_factory):
            user = user_factory()
            org = org_factory()
            org_access_factory(user=user, org=org)
            user_org = Org.objects.get_by_username(user.username)
            assert str(user_org) == str(org)
