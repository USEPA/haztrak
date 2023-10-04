from django.urls import include, path
from rest_framework import routers

from apps.trak.views import (
    CreateRcraManifestView,
    FederalWasteCodesView,
    ManifestView,
    MtnList,
    PullManifestView,
    SignManifestView,
    StateWasteCodesView,
    SyncSiteManifestView,
)

manifest_router = routers.SimpleRouter(trailing_slash=False)
manifest_router.register(r"manifest", ManifestView)

urlpatterns = [
    # Manifest
    path("", include(manifest_router.urls)),
    path("rcra/manifest/create", CreateRcraManifestView.as_view()),
    path("manifest/pull", PullManifestView.as_view()),
    path("manifest/sign", SignManifestView.as_view()),
    path("manifest/sync", SyncSiteManifestView.as_view()),
    # MTN
    path("mtn", MtnList.as_view()),
    path("mtn/<str:epa_id>", MtnList.as_view()),
    # Codes
    path("code/waste/federal", FederalWasteCodesView.as_view()),
    path("code/waste/state/<str:state_id>", StateWasteCodesView.as_view()),
]
