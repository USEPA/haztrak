from apps.site.services import filter_sites_by_org


class TestFilterOrgSites:
    def test_get_org_sites(self, org_factory, site_factory):
        org = org_factory()
        site = site_factory(org=org)
        returned_sites = filter_sites_by_org(org_id=org.id)
        assert site in returned_sites
