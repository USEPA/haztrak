from django.urls import path

from .views import (
    TrakOrgSitesListView,
    TrakSiteDetailsView,
    TrakSiteListView,
)

urlpatterns = [
    path("site", TrakSiteListView.as_view()),
    path("site/<str:epa_id>", TrakSiteDetailsView.as_view()),
    path("org/<str:org_id>/sites", TrakOrgSitesListView.as_view()),
]
