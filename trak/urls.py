from django.urls import path
from . import views

urlpatterns = [
        path('', views.trak_home, name='trak'),
        path('sync/<int:num>', views.sync, name='sync')
]
