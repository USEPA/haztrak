import json
from datetime import UTC, datetime

import pytest
from core.services import RcraClient

from manifest.services.emanifest_search import EmanifestSearch


class TestEmanifestSearchClass:
    def test_defaults_to_unauthenticated_rcra_client(self):
        search = EmanifestSearch()
        assert search.rcra_client is not None
        assert search.rcra_client.is_authenticated is False

    @pytest.mark.parametrize("mock_emanifest_auth_response", [["foo", "foo"]], indirect=True)
    def test_execute_sends_a_request_to_rcrainfo(
        self, mock_responses, mock_emanifest_auth_response
    ):
        stub_rcra_client = RcraClient(rcrainfo_env="preprod", api_key="foo", api_id="foo")
        mock_responses.post(
            "https://rcrainfopreprod.epa.gov/rcrainfo/rest/api/v1/emanifest/search"
        )
        result = EmanifestSearch(stub_rcra_client).execute()
        assert result.status_code == 200

    @pytest.mark.parametrize("mock_emanifest_auth_response", [["foo", "foo"]], indirect=True)
    def test_search_builds_json(self, mock_responses, mock_emanifest_auth_response):
        stub_rcra_client = RcraClient(rcrainfo_env="preprod", api_key="foo", api_id="foo")
        mock_responses.post(
            "https://rcrainfopreprod.epa.gov/rcrainfo/rest/api/v1/emanifest/search"
        )
        EmanifestSearch(stub_rcra_client).add_state_code("CA").add_site_type(
            "Generator"
        ).add_site_id("VATESTGEN001").execute()
        for call in mock_responses.calls:
            if "emanifest/search" in call.request.url:
                request_body = json.loads(call.request.body)
                assert request_body["stateCode"] == "CA"
                assert request_body["siteType"] == "Generator"
                assert request_body["siteId"] == "VATESTGEN001"

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
            now = datetime.now(UTC)
            search = EmanifestSearch().add_end_date()
            end_date = datetime.strptime(search.end_date, RcraClient.datetime_format)
            assert end_date.day == now.day
            assert end_date.month == now.month
            assert end_date.year == now.year

    class TestBuildSearchWithCorrectionRequestStatus:
        def test_add_correction_request_status(self):
            search = EmanifestSearch().add_correction_request_status("Sent")
            assert search.correction_request_status == "Sent"

        def test_error_raised_with_invalid_correction_request_status(self):
            with pytest.raises(ValueError):
                EmanifestSearch().add_correction_request_status("InvalidStatus")  # noqa
