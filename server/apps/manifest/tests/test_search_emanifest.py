from datetime import datetime
from unittest.mock import Mock

import pytest

from apps.manifest.services import EManifest
from apps.manifest.services.emanifest import SearchManifestData


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
        response.json.return_value = []
        return response

    def test_mocking_internals(self, mock_rcrainfo, mock_response):
        # Arrange
        emanifest = EManifest(username="test", rcrainfo=mock_rcrainfo)
        search_data: SearchManifestData = {
            "site_id": "test",
            "start_date": datetime.now(),
            "end_date": datetime.now(),
        }
        # Act
        result = emanifest.search(search_data)
        # Assert
        assert result == []
        assert mock_rcrainfo.search_mtn.call_count == 1

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
