from django.urls import path

from . import views

urlpatterns = [
    path('', views.sites_dashboard, name='trak'),
    path('<str:epa_id>/details', views.sites_details, name='site_details'),
    path('<str:epa_id>/manifests', views.site_manifests, name='site_manifests'),
    path('manifest/<int:manifest_id>', views.manifest_view, name='manifest'),
    path('intransit/', views.manifests_in_transit, name='in_transit'),
]
