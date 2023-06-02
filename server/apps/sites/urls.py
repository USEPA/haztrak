from django.urls import path

from apps.sites.views import (
    RcraProfileView,
    RcraSitePermissionView,
    RcraSiteSearchView,
    RcraSiteView,
    SiteDetailView,
    SiteListView,
    SiteMtnListView,
    SyncProfileView,
)

urlpatterns = [
    # Rcra Profile
    path("profile/<str:user>/sync", SyncProfileView.as_view()),
    path("profile/<str:user>", RcraProfileView.as_view()),
    path("site/permission/<int:pk>", RcraSitePermissionView.as_view()),
    # Site
    path("site/", SiteListView.as_view()),
    path("site/<str:epa_id>", SiteDetailView.as_view()),
    path("site/<str:epa_id>/manifest", SiteMtnListView.as_view()),
    path("site/rcra-site/search", RcraSiteSearchView.as_view()),
    path("site/rcra-site/<int:pk>", RcraSiteView.as_view()),
]
