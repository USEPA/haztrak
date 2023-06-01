from django.urls import include, path
from rest_framework import routers

from apps.trak.views import (
    FederalWasteCodes,
    HandlerView,
    ManifestView,
    MtnList,
    PullManifestView,
    SignManifestView,
    TransporterView,
)

manifest_router = routers.SimpleRouter()
manifest_router.register(r"manifest", ManifestView)

urlpatterns = [
    # Manifest
    path("trak/", include(manifest_router.urls)),
    path("trak/manifest/pull", PullManifestView.as_view()),
    path("trak/manifest/sign", SignManifestView.as_view()),
    path("trak/mtn", MtnList.as_view()),
    path("trak/mtn/<str:epa_id>", MtnList.as_view()),
    # Handler
    path("trak/transporter/<int:pk>", TransporterView.as_view()),
    path("trak/mtnhandler/<int:pk>", HandlerView.as_view()),
    # code
    path("trak/code/waste/federal", FederalWasteCodes.as_view()),
]
