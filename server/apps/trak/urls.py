from django.urls import include, path

from apps.trak.views import (  # type: ignore
    CreateRcraManifestView,
    FederalWasteCodesView,
    ManifestView,
    MtnList,
    SignManifestView,
    StateWasteCodesView,
    SyncSiteManifestView,
)

urlpatterns = [
    path(
        "rcra/",
        include(
            [
                # Manifest
                path("manifest/<str:mtn>", ManifestView.as_view()),
                path("manifest/create", CreateRcraManifestView.as_view()),
                path("manifest/sign", SignManifestView.as_view()),
                path("manifest/sync", SyncSiteManifestView.as_view()),
                # MTN
                path("mtn", MtnList.as_view()),
                path("mtn/<str:epa_id>", MtnList.as_view()),
                # Codes
                path("code/waste/federal", FederalWasteCodesView.as_view()),
                path("code/waste/state/<str:state_id>", StateWasteCodesView.as_view()),
            ]
        ),
    ),
]
