from django.urls import path

from .views import ExampleTaskView, Login, TaskStatusView

urlpatterns = [
    path("user/login/", Login.as_view()),
    path("task/example", ExampleTaskView.as_view()),
    path("task/<str:task_id>", TaskStatusView.as_view()),
]
