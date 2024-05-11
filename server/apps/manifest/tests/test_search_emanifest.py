from datetime import datetime, timezone
from unittest.mock import Mock, patch

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
                EmanifestSearch().add_status("InvalidStatus")  # noqa

    class TestBuildSearchWithSiteId:
        def test_add_site_id(self):
            search = EmanifestSearch().add_site_id("test")
            assert search.site_id == "test"
            search_2 = EmanifestSearch().add_site_id("test123")
            assert search_2.site_id == "test123"

        def test_site_id_is_alphanumeric(self):
            with pytest.raises(ValueError):
                EmanifestSearch().add_site_id("test!")

    class TestBuildSearchWithSiteType:
        def test_add_site_type(self):
            search = EmanifestSearch().add_site_type("Generator")
            assert search.site_type == "Generator"

        def test_error_raised_with_invalid_site_type(self):
            with pytest.raises(ValueError):
                EmanifestSearch().add_site_type("InvalidSiteType")  # noqa

    class TestBuildSearchWithDateType:
        def test_add_date_type(self):
            search = EmanifestSearch().add_date_type("CertifiedDate")
            assert search.date_type == "CertifiedDate"

        def test_raises_error_with_invalid_date_type(self):
            with pytest.raises(ValueError):
                EmanifestSearch().add_date_type("InvalidDateType")  # noqa

    class TestBuildSearchWithDates:
        def test_add_start_date(self):
            search = EmanifestSearch().add_start_date(datetime.now())
            assert search.start_date is not None

        def test_add_end_date(self):
            search = EmanifestSearch().add_end_date(datetime.now())
            assert search.end_date is not None

        def test_add_end_date_defaults_to_now(self):
            with patch("apps.manifest.services.emanifest_search.datetime") as mock_datetime:
                mock_datetime.now.return_value = datetime(2021, 1, 1).replace(tzinfo=timezone.utc)
                search = EmanifestSearch().add_end_date()
                assert search.end_date is not None
                assert search.end_date == datetime(2021, 1, 1).replace(tzinfo=timezone.utc)

    class TestBuildSearchWithCorrectionRequestStatus:
        def test_add_correction_request_status(self):
            search = EmanifestSearch().add_correction_request_status("Sent")
            assert search.correction_request_status == "Sent"

        def test_error_raised_with_invalid_correction_request_status(self):
            with pytest.raises(ValueError):
                EmanifestSearch().add_correction_request_status("InvalidStatus")  # noqa
