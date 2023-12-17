import pytest

from apps.core.services import RcrainfoService
from apps.site.models import RcraSite
from apps.site.services import RcraSiteService


class TestHandlerService:
    @pytest.fixture(autouse=True)
    def _setup(self, user_factory, rcra_profile_factory, haztrak_json, haztrak_profile_factory):
        self.user = user_factory()
        self.rcra_profile = rcra_profile_factory()
        self.profile = haztrak_profile_factory(user=self.user, rcrainfo_profile=self.rcra_profile)
        self.handler_json = haztrak_json.HANDLER.value
        self.epa_id = self.handler_json.get("epaSiteId", "handler001")

    def test_rcrainfo_returns_true_when_instance(self):
        """
        the e-Manifest PyPI package RcrainfoClient uses a __bool__ method we need to override
        in order for self.rcrainfo = rcrainfo or RcrainfoService(...) to work.
        """
        # Arrange
        rcrainfo = RcrainfoService(auto_renew=False)
        # Act and Assert
        assert rcrainfo  # should return true

    def test_pulls_site_details_from_rcrainfo(self, mock_responses):
        """test pulling a rcra_site's information from rcrainfo"""
        # Arrange
        rcrainfo = RcrainfoService(auto_renew=False)
        handler_service = RcraSiteService(username=self.user.username, rcrainfo=rcrainfo)
        rcrainfo_site_details_url = f"{rcrainfo.base_url}v1/site-details/{self.epa_id}"
        # mock response from Rcrainfo
        mock_responses.get(
            rcrainfo_site_details_url,
            json=self.handler_json,
            status=200,
        )
        # Act
        rcra_site = handler_service.pull_rcrainfo_site(site_id=self.epa_id)
        # Assert
        assert isinstance(rcra_site, RcraSite)
