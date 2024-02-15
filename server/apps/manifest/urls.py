from django.urls import include, path
from rest_framework.routers import SimpleRouter

from apps.manifest.views import (  # type: ignore
    ManifestViewSet,
    MtnListView,
    SaveElectronicManifestView,
    SignManifestView,
    SyncSiteManifestView,
)

manifest_router = SimpleRouter(trailing_slash=False)
manifest_router.register("manifest", ManifestViewSet, basename="manifest")

urlpatterns = [
    path(
        "manifest/",
        include(
            [
                # Manifest
                path("emanifest", SaveElectronicManifestView.as_view()),
                path("emanifest/sign", SignManifestView.as_view()),
                path("emanifest/sync", SyncSiteManifestView.as_view()),
                path("", include(manifest_router.urls)),
                # MT
                path("mtn", MtnListView.as_view()),
                path("mtn/<str:epa_id>", MtnListView.as_view()),
                path("mtn/<str:epa_id>/<str:site_type>", MtnListView.as_view()),
            ]
        ),
    ),
]
