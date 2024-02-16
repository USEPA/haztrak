from django.urls import include, path

from .views import (
    HaztrakProfileView,
    RcrainfoProfileView,
    SyncRcrainfoProfileView,
)

urlpatterns = [
    path(
        "user",
        include(
            [
                path("/profile", HaztrakProfileView.as_view()),
                path("/rcrainfo-profile/sync", SyncRcrainfoProfileView.as_view()),
                path("/rcrainfo-profile/<str:username>", RcrainfoProfileView.as_view()),
            ]
        ),
    ),
]
