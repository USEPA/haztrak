import uuid

import pytest

from apps.sites.services.org_services import get_org, get_org_rcrainfo_api_credentials


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
