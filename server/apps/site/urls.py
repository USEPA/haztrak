from django.urls import path

from .views import (
    OrgSitesListView,
    SiteDetailsView,
    SiteListView,
)

app_name = "site"
urlpatterns = [
    path("site", SiteListView.as_view(), name="list"),
    path("site/<str:epa_id>", SiteDetailsView.as_view(), name="details"),
    path("org/<str:org_id>/sites", OrgSitesListView.as_view(), name="org-sites"),
]
