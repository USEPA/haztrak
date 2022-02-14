from django.urls import path

from . import views

urlpatterns = [
        path('', views.home),
        path('about/', views.about, name='about')
        ]
