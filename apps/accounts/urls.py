from django.urls import path

from . import views

urlpatterns = [
    path('signup/', views.signup_haztrak, name='signup'),
    path('profile/', views.profile, name='profile'),
    path('logout/', views.logout_haztrak, name='logout'),
    path('login/', views.login_haztrak, name='login'),
]
