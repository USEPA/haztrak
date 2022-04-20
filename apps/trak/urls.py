from django.urls import path

from . import views

urlpatterns = [
    path('', views.trak_home, name='trak'),
    path('manifest/<int:manifest_id>', views.manifest_view, name='manifest'),
    path('intransit/', views.manifests_in_transit, name='in_transit'),
]
