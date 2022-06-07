from django.urls import path

from . import views

urlpatterns = [
    # Site Views
    path('', views.Sites.as_view(), name='trak'),
    path('<int:pk>/details', views.SiteDetails.as_view(), name='site_details'),
    path('<str:epa_id>/manifests', views.SiteManifests.as_view(),
         name='site_manifests'),
    # Manifest Views
    path('manifest/<int:pk>', views.ManifestDetails.as_view(), name='manifest_details'),
    path('manifest_update/<int:pk>', views.ManifestUpdate.as_view(),
         name='manifest_update'),
    # Misc
    path('intransit/', views.ManifestInTransit.as_view(), name='in_transit'),
]
