from django.urls import include, path

from .views import OrgDetailsView, SiteDetailsView, SiteListView

app_name = "org"

site_urls = (
    [
        path("", SiteListView.as_view(), name="list"),
        path("/<str:epa_id>", SiteDetailsView.as_view(), name="details"),
    ],
    "site",
)

urlpatterns = [
    path("org/<slug:org_slug>", OrgDetailsView.as_view(), name="details"),
    path("org/<slug:org_slug>/sites", SiteListView.as_view(), name="sites"),
    path("site", include(site_urls)),
]
