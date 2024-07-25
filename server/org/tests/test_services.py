import datetime
import uuid
from unittest.mock import patch

import pytest

from org.models import Site
from org.services import (
    filter_sites_by_org,
    get_org_by_id,
    get_org_rcrainfo_api_credentials,
    get_user_site,
    update_emanifest_sync_date,
)


class TestOrgServices:
    def test_get_org_by_id(self, org_factory):
        my_org_uuid = uuid.uuid4()
        created_org = org_factory(org_id=my_org_uuid)
        retrieved_org = get_org_by_id(str(my_org_uuid))
        assert retrieved_org == created_org

    def test_get_organization_stored_rcrainfo_api_credentials(
        self, org_factory, rcrainfo_profile_factory, user_factory, profile_factory
    ):
        my_org_uuid = uuid.uuid4()
        my_api_id = "my_api_id"
        my_api_key = "my_api_key"
        admin_user = user_factory()
        profile_factory(
            user=admin_user,
            rcrainfo_profile=rcrainfo_profile_factory(
                rcra_api_id=my_api_id, rcra_api_key=my_api_key
            ),
        )
        org_factory(org_id=my_org_uuid, admin=admin_user)
        api_id, api_key = get_org_rcrainfo_api_credentials(str(my_org_uuid))
        assert api_id == my_api_id
        assert api_key == my_api_key


class TestFilterSites:
    def test_get_org_sites(self, org_factory, site_factory):
        org = org_factory()
        site = site_factory(org=org)
        returned_sites = filter_sites_by_org(org_id=org.id)
        assert site in returned_sites


class TestGetUserSite:
    def test_returns_site_by_epa_id(self, site_class_factory):
        with patch("org.services.Site.objects.get_by_username_and_epa_id") as mock_query:
            mock_site = site_class_factory()
            mock_query.return_value = mock_site
            result = get_user_site(username="test", epa_id="test")
            assert result == mock_site

    def test_raises_error_when_site_not_found(self, site_class_factory):
        with patch("org.services.Site.objects.get_by_username_and_epa_id") as mock_query:
            mock_query.side_effect = Site.DoesNotExist
            with pytest.raises(Site.DoesNotExist):
                get_user_site(username="test", epa_id="test")


class TestFilterSitesByUser:
    def test_returns_array_of_sites(self, site_factory, user_factory):
        with patch("org.services.Site.objects.filter_by_user") as mock_query:
            site = site_factory()
            mock_query.return_value = [site]
            result = Site.objects.filter_by_user("username")
            assert site in result

    def test_returns_empty_list_when_no_sites_found(self, site_factory, user_factory):
        with patch("org.services.Site.objects.filter_by_user") as mock_query:
            mock_query.return_value = []
            result = Site.objects.filter_by_user("username")
            assert isinstance(result, list)


class TestUpdateEmanifestSyncDate:
    def test_updates_the_last_sync_field(self, site_factory):
        site = site_factory(last_rcrainfo_manifest_sync=None)
        update_emanifest_sync_date(site=site)
        assert site.last_rcrainfo_manifest_sync is not None

    def test_uses_datetime_now_by_default(self, site_factory):
        with patch("org.services.datetime") as mock_datetime:
            mock_datetime.now.return_value = datetime.datetime(2021, 1, 1)
            site = site_factory(last_rcrainfo_manifest_sync=None)
            update_emanifest_sync_date(site=site)
            assert site.last_rcrainfo_manifest_sync == datetime.datetime(2021, 1, 1)

    def test_uses_optional_passed_datetime(self, site_factory):
        passed_datetime = datetime.datetime(2021, 1, 1)
        site = site_factory(last_rcrainfo_manifest_sync=None)
        update_emanifest_sync_date(site=site, last_sync_date=passed_datetime)
        assert site.last_rcrainfo_manifest_sync == passed_datetime
