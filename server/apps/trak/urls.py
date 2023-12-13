from django.urls import include, path, re_path
from rest_framework.routers import DefaultRouter, SimpleRouter

from apps.trak.views import (  # type: ignore
    DotHazardClassView,
    DotIdNumberView,
    DotShippingNameView,
    FederalWasteCodesView,
    ManifestViewSet,
    MtnListView,
    SaveElectronicManifestView,
    SignManifestView,
    StateWasteCodesView,
    SyncSiteManifestView,
)

manifest_router = SimpleRouter(trailing_slash=False)
manifest_router.register("manifest", ManifestViewSet, basename="manifest")

urlpatterns = [
    path(
        "rcra/",
        include(
            [
                # Manifest
                path("", include(manifest_router.urls)),
                path("manifest/emanifest", SaveElectronicManifestView.as_view()),
                path("manifest/emanifest/sign", SignManifestView.as_view()),
                path("manifest/emanifest/sync", SyncSiteManifestView.as_view()),
                # MT
                path("mtn", MtnListView.as_view()),
                path("mtn/<str:epa_id>", MtnListView.as_view()),
                path("mtn/<str:epa_id>/<str:site_type>", MtnListView.as_view()),
                # waste info
                path(
                    "waste/",
                    include(
                        [
                            path("code/federal", FederalWasteCodesView.as_view()),
                            path("code/state/<str:state_id>", StateWasteCodesView.as_view()),
                            path("dot/id", DotIdNumberView.as_view()),
                            path("dot/class", DotHazardClassView.as_view()),
                            path("dot/name", DotShippingNameView.as_view()),
                        ]
                    ),
                ),
            ]
        ),
    ),
]
