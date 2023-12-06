from django.urls import include, path, re_path

from apps.trak.views import (  # type: ignore
    CreateManifestView,
    DotHazardClassView,
    DotIdNumberView,
    DotShippingNameView,
    FederalWasteCodesView,
    GetManifestView,
    MtnListView,
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
                path("manifest", CreateManifestView.as_view()),
                path("manifest/sign", SignManifestView.as_view()),
                path("manifest/sync", SyncSiteManifestView.as_view()),
                re_path(r"manifest/(?P<mtn>[0-9]{9}[a-zA-Z]{3})", GetManifestView.as_view()),
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
