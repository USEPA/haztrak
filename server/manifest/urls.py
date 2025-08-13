"""URLs for the manifest app."""

from django.urls import include, path
from manifest.views import (
    ElectronicManifestSaveView,
    ElectronicManifestSignView,
    ManifestViewSet,
    MtnListView,
    SiteManifestSyncView,
)
from rest_framework.routers import SimpleRouter

manifest_router = SimpleRouter(trailing_slash=False)
manifest_router.register("manifest", ManifestViewSet)

emanifest_patterns = (
    [
        path("", ElectronicManifestSaveView.as_view(), name="save"),
        path("sign", ElectronicManifestSignView.as_view(), name="sign"),
        path("sync", SiteManifestSyncView.as_view(), name="sync"),
    ],
    "emanifest",
)

mtn_patterns = (
    [
        path("", MtnListView.as_view(), name="list"),
        path("<str:epa_id>", MtnListView.as_view(), name="site-list"),
        path("<str:epa_id>/<str:site_type>", MtnListView.as_view(), name="site-type-list"),
    ],
    "mtn",
)

app_name = "manifest"
urlpatterns = [
    # e-Manifest
    path("manifest/emanifest", include(emanifest_patterns)),
    # Manifest Tracking Numbers
    path("manifest/mtn", include(mtn_patterns)),
    # Manifests
    path("", include(manifest_router.urls)),
]
