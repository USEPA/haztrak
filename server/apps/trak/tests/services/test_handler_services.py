import pytest
import responses

from apps.trak.models import EpaSite
from apps.trak.services import EpaSiteService, RcrainfoService


class TestHandlerService:
    @pytest.fixture(autouse=True)
    def _setup(self, user_factory, rcra_profile_factory, haztrak_json):
        self.user = user_factory()
        self.profile = rcra_profile_factory(user=self.user)
        self.handler_json = haztrak_json.HANDLER.value
        self.epa_id = self.handler_json.get("epaSiteId", "handler001")

    def test_stores_rcrainfo_instance(self):
        """
        the e-Manifest PyPI package RcrainfoClient uses a __bool__ method we need to override
        in order for self.rcrainfo = rcrainfo or RcrainfoService(...) to work.
        """
        rcrainfo = RcrainfoService(api_username=self.user.username, auto_renew=False)
        handler_service = EpaSiteService(username=self.user.username, rcrainfo=rcrainfo)
        assert handler_service.rcrainfo is rcrainfo

    def test_creates_rcrainfo_instance_when_none(self):
        """
        the e-Manifest PyPI package RcrainfoClient uses a __bool__ method we need to override
        in order for self.rcrainfo = rcrainfo or RcrainfoService(...) to work.
        """
        handler_service = EpaSiteService(username=self.user.username)
        assert isinstance(handler_service.rcrainfo, RcrainfoService)

    def test_pull_rcra_handler(self, mock_responses):
        """test pulling a epa_site's information from rcrainfo"""
        rcrainfo = RcrainfoService(api_username=self.user.username, auto_renew=False)
        handler_service = EpaSiteService(username=self.user.username, rcrainfo=rcrainfo)
        handler_url = f"{rcrainfo.base_url}/api/v1/site-details/{self.epa_id}"

        mock_responses.get(handler_url, json=self.handler_json, status=200)
        results = handler_service.pull_epa_site(site_id=self.epa_id)
        assert isinstance(results, EpaSite)
