from django.urls import include, path

from rcrasite.views import HandlerSearchView, RcraSiteDetailsView, RcraSiteSearchView

rcrainfo_rcrasite_patterns = (
    [
        path("/rcrasite/search", HandlerSearchView.as_view(), name="search"),
    ],
    "rcrainfo",
)

app_name = "rcrasite"
urlpatterns = [
    path("rcrainfo", include(rcrainfo_rcrasite_patterns)),
    path("rcrasite/search", RcraSiteSearchView.as_view(), name="search"),
    path("rcrasite/<str:epa_id>", RcraSiteDetailsView.as_view(), name="details"),
]
