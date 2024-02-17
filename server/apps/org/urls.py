from django.urls import path

from apps.org.views import TrakOrgDetailsView, TrakOrgSitesListView

urlpatterns = [
    path("org/<str:org_id>/site", TrakOrgSitesListView.as_view()),
    path("org/<str:org_id>", TrakOrgDetailsView.as_view()),
]
