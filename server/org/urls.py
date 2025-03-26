"""URLs for the org app."""

from django.urls import include, path

from .views import OrgDetailsView, OrgListView, SiteDetailsView, SiteListView

app_name = "org"

site_urls = (
    # Deprecated: ToDo move all sites/* endpoints under the org namespace
    # e.g., /org/<org>/sites/<epa_id>
    # or    /org/<org>/sites
    [
        path("", SiteListView.as_view(), name="list"),
        path("/<str:epa_id>", SiteDetailsView.as_view(), name="details"),
    ],
    "site",
)

urlpatterns = [
    path("orgs", OrgListView.as_view(), name="list"),
    path("orgs/<slug:org_slug>", OrgDetailsView.as_view(), name="details"),
    path("orgs/<slug:org_slug>/sites", SiteListView.as_view(), name="sites"),
    path("sites", include(site_urls)),
]
