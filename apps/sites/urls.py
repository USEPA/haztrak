from django.urls import path
from . import views

urlpatterns = [
        path('', views.sites_dashboard, name='sites'),
        path('<str:epa_id>/details', views.sites_details, name='site_details'),
        path('<str:epa_id>/manifests', views.site_manifests, name='site_manifests'),
]
