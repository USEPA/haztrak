from dj_rest_auth.views import LoginView, LogoutView, UserDetailsView
from django.urls import include, path

from .views import (  # type: ignore
    HaztrakProfileView,
    HaztrakSiteDetailsView,
    HaztrakSiteListView,
    LaunchExampleTaskView,
    RcrainfoProfileView,
    SyncRcrainfoProfileView,
    TaskStatusView,
)

urlpatterns = [
    path("task/example", LaunchExampleTaskView.as_view()),
    path("task/<str:task_id>", TaskStatusView.as_view()),
    path(
        "user",
        include(
            [
                path("", UserDetailsView.as_view(), name="rest_user_details"),
                path("/login", LoginView.as_view(), name="rest_login"),
                path("/logout", LogoutView.as_view(), name="rest_logout"),
                path("/profile", HaztrakProfileView.as_view()),
                path("/rcrainfo-profile/sync", SyncRcrainfoProfileView.as_view()),
                path("/rcrainfo-profile/<str:username>", RcrainfoProfileView.as_view()),
            ]
        ),
    ),
    path("site", HaztrakSiteListView.as_view()),
    path("site/<str:epa_id>", HaztrakSiteDetailsView.as_view()),
]
