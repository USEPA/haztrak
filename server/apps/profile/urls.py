from django.urls import include, path

from .views import (
    RcrainfoProfileDetailsView,
    RcrainfoProfileSyncView,
    TrakProfileDetailsView,
)

urlpatterns = [
    path(
        "user",
        include(
            [
                path("/profile", TrakProfileDetailsView.as_view()),
                path("/rcrainfo-profile/sync", RcrainfoProfileSyncView.as_view()),
                path("/rcrainfo-profile/<str:username>", RcrainfoProfileDetailsView.as_view()),
            ]
        ),
    ),
]
