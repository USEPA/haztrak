from django.urls import include, path
from rest_framework import routers

from apps.trak.views import (
    FederalWasteCodesView,
    ManifestView,
    MtnList,
    PullManifestView,
    SignManifestView,
    SyncSiteManifestView,
)

manifest_router = routers.SimpleRouter()
manifest_router.register(r"manifest", ManifestView)

urlpatterns = [
    # Manifest
    path("", include(manifest_router.urls)),
    path("manifest/pull", PullManifestView.as_view()),
    path("manifest/sign", SignManifestView.as_view()),
    path("manifest/sync", SyncSiteManifestView.as_view()),
    # MTN
    path("mtn", MtnList.as_view()),
    path("mtn/<str:epa_id>", MtnList.as_view()),
    # Codes
    path("code/waste/federal", FederalWasteCodesView.as_view()),
    # path("code/waste/state/<str:state_id>", PLACEHOLDER.as_view()),
]
