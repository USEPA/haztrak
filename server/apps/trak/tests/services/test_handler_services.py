import pytest

from apps.core.services import RcrainfoService
from apps.sites.models import EpaSite
from apps.sites.services import EpaSiteService


class TestHandlerService:
    @pytest.fixture(autouse=True)
    def _setup(self, user_factory, epa_profile_factory, haztrak_json):
        self.user = user_factory()
        self.profile = epa_profile_factory(user=self.user)
        self.handler_json = haztrak_json.HANDLER.value
        self.epa_id = self.handler_json.get("epaSiteId", "handler001")

    def test_rcrainfo_returns_true_when_instance(self):
        """
        the e-Manifest PyPI package RcrainfoClient uses a __bool__ method we need to override
        in order for self.rcrainfo = rcrainfo or RcrainfoService(...) to work.
        """
        # Arrange
        rcrainfo = RcrainfoService(api_username=self.user.username, auto_renew=False)
        # Act and Assert
        assert rcrainfo  # should return true

    def test_pulls_site_details_from_rcrainfo(self, mock_responses):
        """test pulling a epa_site's information from rcrainfo"""
        # Arrange
        rcrainfo = RcrainfoService(api_username=self.user.username, auto_renew=False)
        handler_service = EpaSiteService(username=self.user.username, rcrainfo=rcrainfo)
        rcrainfo_site_details_url = f"{rcrainfo.base_url}/api/v1/site-details/{self.epa_id}"
        # mock response from Rcrainfo
        mock_responses.get(
            rcrainfo_site_details_url,
            json=self.handler_json,
            status=200,
        )
        # Act
        epa_site = handler_service.pull_epa_site(site_id=self.epa_id)
        # Assert
        assert isinstance(epa_site, EpaSite)
