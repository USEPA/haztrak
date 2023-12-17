import uuid

from apps.core.models import HaztrakProfile, RcraProfile
from apps.site.services.org_services import get_org, get_org_rcrainfo_api_credentials
from apps.site.services.rcra_profile_services import get_or_create_rcra_profile


class TestOrgServices:
    def test_get_org_by_id(self, haztrak_org_factory):
        my_org_uuid = uuid.uuid4()
        created_org = haztrak_org_factory(org_id=my_org_uuid)
        retrieved_org = get_org(str(my_org_uuid))
        assert retrieved_org == created_org

    def test_get_organization_stored_rcrainfo_api_credentials(
        self, haztrak_org_factory, rcra_profile_factory, user_factory, haztrak_profile_factory
    ):
        my_org_uuid = uuid.uuid4()
        my_api_id = "my_api_id"
        my_api_key = "my_api_key"
        admin_user = user_factory()
        haztrak_profile_factory(
            user=admin_user,
            rcrainfo_profile=rcra_profile_factory(rcra_api_id=my_api_id, rcra_api_key=my_api_key),
        )
        haztrak_org_factory(org_id=my_org_uuid, admin=admin_user)
        api_id, api_key = get_org_rcrainfo_api_credentials(str(my_org_uuid))
        assert api_id == my_api_id
        assert api_key == my_api_key


class TestRcraProfileServices:
    def test_get_or_create_retrieves_by_username(
        self, rcra_profile_factory, user_factory, haztrak_profile_factory
    ):
        username = "my_username"
        mock_rcra_username = "my_rcra_username"
        user = user_factory(username=username)
        rcra_profile = rcra_profile_factory(rcra_username=mock_rcra_username)
        haztrak_profile_factory(user=user, rcrainfo_profile=rcra_profile)
        retrieved_rcra_profile, created = get_or_create_rcra_profile(username=username)
        assert retrieved_rcra_profile == rcra_profile
        assert created is False

    def test_get_or_create_returns_true_if_new_profile(self, user_factory):
        username = "my_username"
        user_factory(username=username)
        retrieved_rcra_profile, created = get_or_create_rcra_profile(username=username)
        assert isinstance(retrieved_rcra_profile, RcraProfile)
        assert created is True

    def test_creates_creates_a_haztrak_profile_if_not_present(self, user_factory):
        # Arrange
        username = "my_username"
        user_factory(username=username)  # Note, we are not creating a HaztrakProfile
        # Act
        rcra_profile, created = get_or_create_rcra_profile(username=username)
        # Assert
        haztrak_profile = HaztrakProfile.objects.get(user__username=username)
        assert haztrak_profile.rcrainfo_profile == rcra_profile
