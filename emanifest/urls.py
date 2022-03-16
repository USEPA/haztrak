from django.urls import path
from . import views

urlpatterns = [
        path('', views.emanifest, name='emanifest')
        ]
