from django.urls import path

from apps.org.views import TrakOrgDetailsView

urlpatterns = [
    path("org/<str:org_id>", TrakOrgDetailsView.as_view()),
]
