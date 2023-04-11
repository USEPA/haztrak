from django.urls import include, path
from rest_framework import routers

from apps.trak.views import (
    FederalWasteCodes,
    HandlerView,
    ManifestView,
    MtnList,
    PullManifest,
    SignManifestView,
    TransporterView,
)

manifest_router = routers.SimpleRouter()
manifest_router.register(r"manifest", ManifestView)

urlpatterns = [
    # Manifest
    path("", include(manifest_router.urls)),
    path("manifest/pull", PullManifest.as_view()),
    path("manifest/sign", SignManifestView.as_view()),
    path("mtn", MtnList.as_view()),
    path("mtn/<str:epa_id>", MtnList.as_view()),
    # Handler
    path("transporter/<int:pk>", TransporterView.as_view()),
    path("mtnhandler/<int:pk>", HandlerView.as_view()),
    # code
    path("code/waste/federal", FederalWasteCodes.as_view()),
]
