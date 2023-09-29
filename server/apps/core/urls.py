from django.urls import path

from .views import (
    HaztrakUserView,
    LaunchExampleTaskView,
    Login,
    RcraProfileSyncView,
    RcraProfileView,
    RcraSitePermissionView,
    TaskStatusView,
)

urlpatterns = [
    # Rcra Profile
    path("user/<str:username>/rcra/profile/sync", RcraProfileSyncView.as_view()),
    path("user/<str:username>/rcra/profile/", RcraProfileView.as_view()),
    path("site/permission/<int:pk>", RcraSitePermissionView.as_view()),
    path("user/", HaztrakUserView.as_view()),
    path("user/login/", Login.as_view()),
    path("task/example", LaunchExampleTaskView.as_view()),
    path("task/<str:task_id>", TaskStatusView.as_view()),
]
