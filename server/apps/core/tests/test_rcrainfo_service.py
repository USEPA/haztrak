import emanifest
import pytest

from apps.core.services import RcrainfoService


class TestRcrainfoService:
    """Tests the for the RcrainfoService class"""

    @pytest.fixture
    def user(self, user_factory):
        return user_factory()

    def test_rcrainfo_inits_to_correct_environment(self, user):
        rcrainfo = RcrainfoService(api_username=user.username, rcrainfo_env="preprod")
        assert rcrainfo.rcrainfo_env == "preprod"

    def test_rcrainfo_inits_base_url_by_env(self, user):
        rcrainfo_preprod = RcrainfoService(api_username=user.username, rcrainfo_env="preprod")
        assert rcrainfo_preprod.base_url == emanifest.RCRAINFO_PREPROD
        rcrainfo_prod = RcrainfoService(api_username=user.username, rcrainfo_env="prod")
        assert rcrainfo_prod.base_url == emanifest.RCRAINFO_PROD
