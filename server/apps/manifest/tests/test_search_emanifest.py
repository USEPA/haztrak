from datetime import datetime
from unittest.mock import Mock

import pytest

from apps.manifest.services import EManifest
from apps.manifest.services.emanifest import SearchManifestData
from apps.manifest.services.emanifest_search import EmanifestSearch


class TestSearchEManifestService:
    @pytest.fixture()
    def mock_rcrainfo(self):
        rcrainfo_client = Mock()
        rcrainfo_client.datetime_format = "%Y-%m-%d"
        return rcrainfo_client

    @pytest.fixture()
    def mock_response(self):
        response = Mock()
        response.ok = True
        response.json = Mock(return_value=[])
        return response

    def test_end_date_defaults_to_now(self, mock_rcrainfo, mock_response):
        emanifest = EManifest(username="test", rcrainfo=mock_rcrainfo)
        search_data: SearchManifestData = {
            "site_id": "test",
            "start_date": datetime.now(),
        }
        # Act
        emanifest.search(search_data)
        _, kwargs = mock_rcrainfo.search_mtn.call_args
        end_date = kwargs["end_date"]
        assert end_date is not None
        assert end_date == datetime.now().strftime(mock_rcrainfo.datetime_format)

    def test_uses_a_default_start_date(self, mock_rcrainfo, mock_response):
        emanifest = EManifest(username="test", rcrainfo=mock_rcrainfo)
        search_data: SearchManifestData = {
            "site_id": "test",
        }
        # Act
        emanifest.search(search_data)
        _, kwargs = mock_rcrainfo.search_mtn.call_args
        start_date = kwargs["start_date"]
        assert start_date is not None


class TestEmanifestSearchClass:
    class TestBuildSearchWithStateCode:
        def test_add_state_code(self):
            search = EmanifestSearch().add_state_code("CA")
            assert search.state_code == "CA"

        def test_state_code_only_accepts_two_letters(self):
            with pytest.raises(ValueError):
                EmanifestSearch().add_state_code("California")

        def test_state_code_alphabetical(self):
            with pytest.raises(ValueError):
                EmanifestSearch().add_state_code("12")

    class TestBuildSearchWithStatus:
        def test_add_status(self):
            search = EmanifestSearch().add_status("Pending")
            assert search.status == "Pending"

        def test_error_raised_with_invalid_status(self):
            with pytest.raises(ValueError):
                EmanifestSearch().add_status("InvalidStatus")

    class TestBuildSearchWithSiteId:
        def test_add_site_id(self):
            search = EmanifestSearch().add_site_id("test")
            assert search.site_id == "test"

        def test_site_id_defaults_to_none(self):
            search = EmanifestSearch().add_site_id()
            assert search.site_id is None

    class TestBuildSearchWithSiteType:
        def test_add_site_type(self):
            search = EmanifestSearch().add_site_type("Generator")
            assert search.site_type == "Generator"

        def test_error_raised_with_invalid_site_type(self):
            with pytest.raises(ValueError):
                EmanifestSearch().add_site_type("InvalidSiteType")

    class TestBuildSearchWithDateType:
        def test_add_date_type(self):
            search = EmanifestSearch().add_date_type("CertifiedDate")
            assert search.date_type == "CertifiedDate"

        def test_raises_error_with_invalid_date_type(self):
            with pytest.raises(ValueError):
                EmanifestSearch().add_date_type("InvalidDateType")
