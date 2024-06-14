from django.urls import include, path

from .views import (
    ProfileDetailsView,
    RcrainfoProfileRetrieveUpdateView,
    RcrainfoProfileSyncView,
)

rcrainfo_profile_patterns = (
    [
        path("/sync", RcrainfoProfileSyncView.as_view(), name="sync"),
        path(
            "/<str:username>", RcrainfoProfileRetrieveUpdateView.as_view(), name="retrieve-update"
        ),
    ],
    "rcrainfo",
)

app_name = "profile"
urlpatterns = [
    path("profile", ProfileDetailsView.as_view(), name="details"),
    path("rcrainfo-profile", include(rcrainfo_profile_patterns)),
]
