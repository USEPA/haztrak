from django.urls import path

from . import views

urlpatterns = [
    path('', views.Sites.as_view(), name='trak'),
    path('<str:id_number>/details', views.SiteDetails.as_view(), name='site_details'),
    path('<str:epa_id>/manifests', views.SiteManifests.as_view(),
         name='site_manifests'),
    path('manifest/<int:pk>', views.ManifestDetails.as_view(),
         name='manifest'),
    path('intransit/', views.ManifestInTransit.as_view(), name='in_transit'),
]
