from django.urls import path

from apps.rcrasite.views import (  # type: ignore
    GetRcraSiteView,
    SearchHandlerView,
    SearchRcraSiteView,
)

urlpatterns = [
    path("handler/search", SearchHandlerView.as_view()),
    path("handler/<str:epa_id>", GetRcraSiteView.as_view()),
    path("site/search", SearchRcraSiteView.as_view()),
]
