from django.urls import include, path

from .views import (
    RcrainfoProfileRetrieveUpdateView,
    RcrainfoProfileSyncView,
    TrakProfileDetailsView,
)

app_name = "profile"
urlpatterns = [
    path(
        "user",
        include(
            [
                path("/profile", TrakProfileDetailsView.as_view()),
                path("/rcrainfo-profile/sync", RcrainfoProfileSyncView.as_view()),
                path(
                    "/rcrainfo-profile/<str:username>", RcrainfoProfileRetrieveUpdateView.as_view()
                ),
            ]
        ),
    ),
]
