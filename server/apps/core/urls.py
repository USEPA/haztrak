from django.urls import include, path

from .views import (  # type: ignore
    HaztrakUserView,
    LaunchExampleTaskView,
    Login,
    RcraProfileSyncView,
    RcraProfileView,
    TaskStatusView,
)

urlpatterns = [
    # Rcra Profile
    path(
        "rcra/",
        include(
            [
                path("profile/<str:username>/sync", RcraProfileSyncView.as_view()),
                path("profile/<str:username>", RcraProfileView.as_view()),
            ]
        ),
    ),
    path("user", HaztrakUserView.as_view()),
    path("user/login", Login.as_view()),
    path("task/example", LaunchExampleTaskView.as_view()),
    path("task/<str:task_id>", TaskStatusView.as_view()),
]
