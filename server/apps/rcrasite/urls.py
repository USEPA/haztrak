from django.urls import path

from apps.rcrasite.views import (  # type: ignore
    HandlerSearchView,
    RcraSiteDetailsView,
    RcraSiteSearchView,
)

app_name = "rcrasite"
urlpatterns = [
    path("handler/search", HandlerSearchView.as_view()),
    path("handler/<str:epa_id>", RcraSiteDetailsView.as_view()),
    path("site/search", RcraSiteSearchView.as_view()),
]
