from django.urls import include, path

from .views import OrgDetailsView, OrgSitesListView, SiteDetailsView, SiteListView

app_name = "org"

site_urls = (
    [
        path("site", SiteListView.as_view(), name="list"),
        path("site/<str:epa_id>", SiteDetailsView.as_view(), name="details"),
    ],
    "site",
)

urlpatterns = [
    path("org/<str:org_id>", OrgDetailsView.as_view(), name="details"),
    path("org/<str:org_id>/sites", OrgSitesListView.as_view(), name="sites"),
    path("site", include(site_urls)),
]
