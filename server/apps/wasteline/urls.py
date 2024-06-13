from django.urls import include, path

from apps.wasteline.views import (  # type: ignore
    DotHazardClassView,
    DotIdNumberView,
    DotShippingNameView,
    FederalWasteCodesView,
    StateWasteCodesView,
)

app_name = "wasteline"
urlpatterns = [
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
