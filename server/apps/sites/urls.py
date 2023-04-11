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
    SyncSiteManifestView,
)

urlpatterns = [
    # Rcra Profile
    path("profile/<str:user>/sync", SyncProfileView.as_view()),
    path("profile/<str:user>", RcraProfileView.as_view()),
    path("permission/<int:pk>", RcraSitePermissionView.as_view()),
    # Site
    path("", SiteListView.as_view()),
    path("<str:epa_id>", SiteDetailView.as_view()),
    path("<str:epa_id>/manifest", SiteMtnListView.as_view()),
    path("manifest/sync", SyncSiteManifestView.as_view()),
    # RcraSite
    path("handler/search", RcraSiteSearchView.as_view()),
    path("handler/details/<int:pk>", RcraSiteView.as_view()),
]
