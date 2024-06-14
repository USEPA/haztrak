from dj_rest_auth.views import LoginView, LogoutView, UserDetailsView
from django.urls import include, path

from .views import LaunchExampleTaskView, TaskStatusView

user_patterns = (
    [
        path("", UserDetailsView.as_view(), name="details"),
        path("/login", LoginView.as_view(), name="login"),
        path("/logout", LogoutView.as_view(), name="logout"),
    ],
    "user",
)

task_patterns = (
    [
        path("/example", LaunchExampleTaskView.as_view(), name="example"),
        path("/<str:task_id>", TaskStatusView.as_view(), name="status"),
    ],
    "task",
)

app_name = "core"
urlpatterns = [
    path("task", include(task_patterns)),
    path("user", include(user_patterns)),
]
