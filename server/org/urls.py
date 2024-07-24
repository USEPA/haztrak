from django.urls import path

from org.views import OrgDetailsView

app_name = "org"
urlpatterns = [
    path("org/<str:org_id>", OrgDetailsView.as_view(), name="details"),
]
