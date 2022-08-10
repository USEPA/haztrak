from django.urls import path

from . import views

urlpatterns = [
    # User
    path('profile/', views.ProfileView.as_view()),
    # Authentication
    path('signup/', views.SignUp.as_view()),
    path('login/', views.Login.as_view()),
]
