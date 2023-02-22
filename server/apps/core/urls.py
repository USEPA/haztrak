from django.urls import path

from . import views

urlpatterns = [
    # Authentication
    path("login/", views.Login.as_view()),
]
