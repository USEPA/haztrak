import uuid

from apps.org.models import HaztrakOrg
from apps.org.services import get_org, get_org_rcrainfo_api_credentials


# Create your tests here.
class TestHaztrakOrgModel:
    def test_haztrak_org_factory(self, haztrak_org_factory):
        org = haztrak_org_factory()
        assert isinstance(org, HaztrakOrg)

    def test_getting_org_api_credentials(
        self, haztrak_org_factory, rcra_profile_factory, user_factory, haztrak_profile_factory
    ):
        # Arrange
        mock_api_id = "03048337-f790-4d18-b579-491d7c1fbb04"
        mock_api_key = "NeSogenKnxTjwwltaMJ"
        admin = user_factory(username="admin")
        rcra_profile = rcra_profile_factory(rcra_api_id=mock_api_id, rcra_api_key=mock_api_key)
        haztrak_profile_factory(user=admin, rcrainfo_profile=rcra_profile)
        org = haztrak_org_factory(admin=admin)
        # Act
        api_id, api_key = org.rcrainfo_api_id_key
        # Assert
        assert api_id == mock_api_id
        assert api_key == mock_api_key

    def test_rcrainfo_integrated_false_without_credentials(
        self, haztrak_org_factory, rcra_profile_factory, user_factory, haztrak_profile_factory
    ):
        # Arrange
        admin = user_factory(username="admin")
        rcra_profile = rcra_profile_factory(rcra_api_id=None, rcra_api_key=None)
        haztrak_profile_factory(user=admin, rcrainfo_profile=rcra_profile)
        org = haztrak_org_factory(admin=admin)
        # Act/Assert
        assert not org.is_rcrainfo_integrated

    def test_rcrainfo_integrated_true_with_credentials(
        self, haztrak_org_factory, rcra_profile_factory, user_factory, haztrak_profile_factory
    ):
        # Arrange
        mock_api_id = "03048337-f790-4d18-b579-491d7c1fbb04"
        mock_api_key = "NeSogenKnxTjwwltaMJ"
        admin = user_factory(username="admin")
        rcra_profile = rcra_profile_factory(rcra_api_id=mock_api_id, rcra_api_key=mock_api_key)
        haztrak_profile_factory(user=admin, rcrainfo_profile=rcra_profile)
        org = haztrak_org_factory(admin=admin)
        # Act/Assert
        assert org.is_rcrainfo_integrated


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
