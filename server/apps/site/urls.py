from django.urls import path

from .views import (
    HaztrakSiteDetailsView,
    HaztrakSiteListView,
)

urlpatterns = [
    path("site", HaztrakSiteListView.as_view()),
    path("site/<str:epa_id>", HaztrakSiteDetailsView.as_view()),
]
