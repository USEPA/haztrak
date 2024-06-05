import json

import pytest

from apps.core.services import RcraClient
from apps.rcrasite.services import RcraSiteSearch


class TestRcraSiteSearchClass:
    def test_defaults_to_unauthenticated_rcra_client(self):
        search = RcraSiteSearch()
        assert search.rcra_client is not None
        assert search.rcra_client.is_authenticated is False

    @pytest.mark.parametrize("mock_emanifest_auth_response", [["foo", "foo"]], indirect=True)
    def test_execute_sends_a_request_to_rcrainfo(
        self, mock_responses, mock_emanifest_auth_response
    ):
        stub_rcra_client = RcraClient(rcrainfo_env="preprod", api_key="foo", api_id="foo")
        mock_responses.post("https://rcrainfopreprod.epa.gov/rcrainfo/rest/api/v1/site-search")
        result = RcraSiteSearch(stub_rcra_client).execute()
        assert result.status_code == 200

    @pytest.mark.parametrize("mock_emanifest_auth_response", [["foo", "foo"]], indirect=True)
    def test_search_builds_json(self, mock_responses, mock_emanifest_auth_response):
        stub_rcra_client = RcraClient(rcrainfo_env="preprod", api_key="foo", api_id="foo")
        mock_responses.post("https://rcrainfopreprod.epa.gov/rcrainfo/rest/api/v1/site-search")
        RcraSiteSearch(stub_rcra_client).state("VA").epa_id("VATESTGEN001").execute()
        for call in mock_responses.calls:
            if "site-search" in call.request.url:
                request_body = json.loads(call.request.body)
                assert request_body["state"] == "VA"
                assert request_body["epaSiteId"] == "VATESTGEN001"

    class TestBuildSearchWithState:
        def test_add_state_code(self):
            search = RcraSiteSearch().state("CA")
            assert "CA" in search.outputs().values()
            assert "state" in search.outputs().keys()

    class TestBuildSearchWithEpaId:
        def test_add_state_code(self):
            partial_id = "VATEST"
            search = RcraSiteSearch().epa_id(partial_id)
            assert partial_id in search.outputs().values()
            assert "epaSiteId" in search.outputs().keys()

    class TestValidation:
        def test_no_validation_error_raised(self):
            assert RcraSiteSearch().state("CA").epa_id("foo").validate()

        def test_error_when_partial_id_without_other_params(self):
            with pytest.raises(ValueError):
                RcraSiteSearch().epa_id("foo").validate()
