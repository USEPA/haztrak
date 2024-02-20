from django.urls import path

from .views import (
    TrakSiteDetailsView,
    TrakSiteListView,
)

urlpatterns = [
    path("site", TrakSiteListView.as_view()),
    path("site/<str:epa_id>", TrakSiteDetailsView.as_view()),
]
