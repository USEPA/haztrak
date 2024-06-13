from django.urls import path

from .views import (
    OrgSitesListView,
    SiteDetailsView,
    SiteListView,
)

app_name = "site"
urlpatterns = [
    path("site", SiteListView.as_view()),
    path("site/<str:epa_id>", SiteDetailsView.as_view()),
    path("org/<str:org_id>/sites", OrgSitesListView.as_view()),
]
