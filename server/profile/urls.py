"""URLs for the profile app."""

from django.urls import include, path
from rest_framework.routers import SimpleRouter

from .views import (
    ProfileDetailsView,
    ProfileViewSet,
    RcrainfoProfileRetrieveUpdateView,
    RcrainfoProfileSyncView,
)

profile_router = SimpleRouter(trailing_slash=False)
profile_router.register("profile", ProfileViewSet)

rcrainfo_profile_patterns = (
    [
        path("sync", RcrainfoProfileSyncView.as_view(), name="sync"),
        path(
            "<str:username>",
            RcrainfoProfileRetrieveUpdateView.as_view(),
            name="retrieve-update",
        ),
    ],
    "rcrainfo",
)

app_name = "profile"
urlpatterns = [
    path("my-profile", ProfileDetailsView.as_view(), name="my-profile"),
    path("rcrainfo-profile/", include(rcrainfo_profile_patterns)),
    path("", include(profile_router.urls)),
]
