from django.urls import include, path

from wasteline.views import (  # type: ignore
    DotHazardClassView,
    DotIdNumberView,
    DotShippingNameView,
    FederalWasteCodesView,
    StateWasteCodesView,
)

dot_patterns = (
    [
        path("id", DotIdNumberView.as_view(), name="id-numbers"),
        path("class", DotHazardClassView.as_view(), name="hazard-classes"),
        path("name", DotShippingNameView.as_view(), name="shipping-names"),
    ],
    "dot",
)

code_patterns = (
    [
        path("federal", FederalWasteCodesView.as_view(), name="federal"),
        path("state/<str:state_id>", StateWasteCodesView.as_view(), name="state"),
    ],
    "code",
)

app_name = "wasteline"
urlpatterns = [
    path(
        "waste/",
        include(
            [
                path("code/", include(code_patterns)),
                path("dot/", include(dot_patterns)),
            ],
        ),
    ),
]
