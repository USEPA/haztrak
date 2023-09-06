from django.urls import path

from .views import (
    ExampleTaskView,
    HaztrakUserView,
    Login,
    RcraProfileView,
    RcraSitePermissionView,
    SyncProfileView,
    TaskStatusView,
    TaskStatusView2,
)

urlpatterns = [
    # Rcra Profile
    path("profile/<str:user>/sync", SyncProfileView.as_view()),
    path("profile/<str:user>", RcraProfileView.as_view()),
    path("site/permission/<int:pk>", RcraSitePermissionView.as_view()),
    path("user/", HaztrakUserView.as_view()),
    path("user/login/", Login.as_view()),
    path("task/example", ExampleTaskView.as_view()),
    path("task/<str:task_id>", TaskStatusView.as_view()),
    path("task/status/<str:task_id>", TaskStatusView2.as_view()),
]
