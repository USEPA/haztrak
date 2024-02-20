import pytest

from apps.site.models import TrakSite


@pytest.mark.django_db
class TestTrakSiteModel:
    def test_haztrak_site_model_factory(self, haztrak_site_factory):
        haztrak_site = haztrak_site_factory()
        assert isinstance(haztrak_site, TrakSite)

    def test_returns_true_if_admin_has_provided_api_credentials(
        self,
        haztrak_site_factory,
        rcra_profile_factory,
        user_factory,
        haztrak_org_factory,
        haztrak_profile_factory,
    ):
        admin = user_factory(username="admin")
        rcra_profile = rcra_profile_factory(rcra_api_id="mock", rcra_api_key="mock")
        haztrak_profile_factory(user=admin, rcrainfo_profile=rcra_profile)
        org = haztrak_org_factory(admin=admin)
        site = haztrak_site_factory(org=org)
        assert site.admin_has_rcrainfo_api_credentials

    def test_returns_false_if_admin_has_not_provided_api_credentials(
        self,
        haztrak_site_factory,
        rcra_profile_factory,
        user_factory,
        haztrak_org_factory,
        haztrak_profile_factory,
    ):
        admin = user_factory(username="admin")
        rcra_profile = rcra_profile_factory(rcra_api_id=None, rcra_api_key=None)
        haztrak_profile_factory(user=admin, rcrainfo_profile=rcra_profile)
        org = haztrak_org_factory(admin=admin)
        site = haztrak_site_factory(org=org)
        assert not site.admin_has_rcrainfo_api_credentials
