from django.urls import path
from . import views

urlpatterns = [
        path('', views.trak_home, name='trak'),
        path('sync/<int:num>', views.sync, name='sync'),
        path('manifest/<int:manifest_id>', views.manifest_view, name='manifest')
]
