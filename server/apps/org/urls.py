from django.urls import path

from apps.org.views import HaztrakOrgSitesListView

urlpatterns = [
    path("org/<str:org_id>/site", HaztrakOrgSitesListView.as_view()),
]
