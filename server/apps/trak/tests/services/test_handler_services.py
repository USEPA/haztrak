import pytest
import responses

from apps.trak.services import HandlerService, RcrainfoService


class TestHandlerService:
    @pytest.fixture(autouse=True)
    def _test_user(self, testuser1):
        self.user = testuser1

    @pytest.fixture(autouse=True)
    def _handler_json(self, handler_json):
        self.handler_json = handler_json
        self.epa_id = handler_json.get("epaSiteId", "handler001")

    @responses.activate
    def test_pull_rcra_handler(self):
        """test pulling a handler's information from rcrainfo"""
        rcrainfo = RcrainfoService(api_username=self.user.username, auto_renew=False)
        handler_service = HandlerService(username=self.user.username, rcrainfo=rcrainfo)
        handler_url = f"{rcrainfo.base_url}/api/v1/site-details/{self.epa_id}"

        with responses.RequestsMock() as mock:
            mock.get(handler_url, json=self.handler_json, status=200)
            results = handler_service.pull_rcra_handler(site_id=self.epa_id)
            print(results)
