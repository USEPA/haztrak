from django.urls import path
from . import views

urlpatterns = [
        path('', views.sites_dashboard, name='sites'),
]