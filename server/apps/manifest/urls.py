from django.urls import include, path
from rest_framework.routers import SimpleRouter

from apps.manifest.views import (  # type: ignore
    ElectronicManifestSaveView,
    ElectronicManifestSignView,
    ManifestViewSet,
    MtnListView,
    SiteManifestSyncView,
)

manifest_router = SimpleRouter(trailing_slash=False)
manifest_router.register("", ManifestViewSet, basename="manifest")

app_name = "manifest"
urlpatterns = [
    path(
        "manifest/",
        include(
            [
                # Manifest
                path("emanifest", ElectronicManifestSaveView.as_view()),
                path("emanifest/sign", ElectronicManifestSignView.as_view()),
                path("emanifest/sync", SiteManifestSyncView.as_view()),
                # MT
                path("mtn", MtnListView.as_view()),
                path("mtn/<str:epa_id>", MtnListView.as_view()),
                path("mtn/<str:epa_id>/<str:site_type>", MtnListView.as_view()),
                path("", include(manifest_router.urls)),
            ]
        ),
    ),
]
