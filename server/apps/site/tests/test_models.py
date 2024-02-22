import pytest

from apps.site.models import TrakSite


@pytest.mark.django_db
class TestTrakSiteModel:
    def test_haztrak_site_model_factory(self, site_factory):
        haztrak_site = site_factory()
        assert isinstance(haztrak_site, TrakSite)

    def test_returns_true_if_admin_has_provided_api_credentials(
        self,
        site_factory,
        rcrainfo_profile_factory,
        user_factory,
        org_factory,
        profile_factory,
    ):
        admin = user_factory(username="admin")
        rcra_profile = rcrainfo_profile_factory(rcra_api_id="mock", rcra_api_key="mock")
        profile_factory(user=admin, rcrainfo_profile=rcra_profile)
        org = org_factory(admin=admin)
        site = site_factory(org=org)
        assert site.admin_has_rcrainfo_api_credentials

    def test_returns_false_if_admin_has_not_provided_api_credentials(
        self,
        site_factory,
        rcrainfo_profile_factory,
        user_factory,
        org_factory,
        profile_factory,
    ):
        admin = user_factory(username="admin")
        rcra_profile = rcrainfo_profile_factory(rcra_api_id=None, rcra_api_key=None)
        profile_factory(user=admin, rcrainfo_profile=rcra_profile)
        org = org_factory(admin=admin)
        site = site_factory(org=org)
        assert not site.admin_has_rcrainfo_api_credentials


class TestTrakSiteModelManager:
    def test_filter_sites_by_username(self, site_factory, site_access_factory, user_factory):
        user = user_factory()
        site = site_factory()
        other_site = site_factory()
        site_access_factory(site=site, user=user)
        sites = TrakSite.objects.filter_by_username(user.username)
        assert site in sites
        assert other_site not in sites

    def test_filter_user_sites(self, site_factory, site_access_factory, user_factory):
        user = user_factory()
        site = site_factory()
        other_site = site_factory()
        site_access_factory(site=site, user=user)
        sites = TrakSite.objects.filter_by_user(user)
        assert site in sites
        assert other_site not in sites

    def test_get_user_site(self, site_factory, site_access_factory, user_factory):
        user = user_factory()
        site = site_factory()
        site_access_factory(site=site, user=user)
        returned_site = TrakSite.objects.get_user_site_by_epa_id(user, site.rcra_site.epa_id)
        assert isinstance(returned_site, TrakSite)
        assert returned_site == site
