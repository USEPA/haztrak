from dj_rest_auth.views import LoginView, LogoutView, UserDetailsView
from django.urls import include, path

from .views import (
    LaunchExampleTaskView,
    TaskStatusView,
)

app_name = "core"
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
            ]
        ),
    ),
]
