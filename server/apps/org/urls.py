from django.urls import path

from apps.org.views import OrgDetailsView

urlpatterns = [
    path("org/<str:org_id>", OrgDetailsView.as_view()),
]
