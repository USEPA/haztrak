from django.urls import include, path

from .views import OrgDetailsView, OrgSitesListView, SiteDetailsView, SiteListView

app_name = "org"

site_urls = (
    [
        path("", SiteListView.as_view(), name="list"),
        path("/<str:epa_id>", SiteDetailsView.as_view(), name="details"),
    ],
    "site",
)

urlpatterns = [
    path("org/<str:org_slug>", OrgDetailsView.as_view(), name="details"),
    path("org/<str:org_id>/sites", OrgSitesListView.as_view(), name="sites"),
    path("site", include(site_urls)),
]
