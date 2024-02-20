from django.urls import path

from apps.org.views import TrakOrgSitesListView

urlpatterns = [
    path("org/<str:org_id>/site", TrakOrgSitesListView.as_view()),
]
