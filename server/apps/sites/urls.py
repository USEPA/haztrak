from django.urls import path

from apps.sites.views import (
    EpaProfileView,
    EpaSiteSearchView,
    EpaSiteView,
    SiteDetailView,
    SiteListView,
    SiteMtnListView,
    SitePermissionView,
    SyncProfileView,
    SyncSiteManifestView,
)

urlpatterns = [
    # Rcra Profile
    path("profile/<str:user>/sync", SyncProfileView.as_view()),
    path("profile/<str:user>", EpaProfileView.as_view()),
    path("permission/<int:pk>", SitePermissionView.as_view()),
    # Site
    path("", SiteListView.as_view()),
    path("<str:epa_id>", SiteDetailView.as_view()),
    path("<str:epa_id>/manifest", SiteMtnListView.as_view()),
    path("manifest/sync", SyncSiteManifestView.as_view()),
    # EpaSite
    path("handler/search", EpaSiteSearchView.as_view()),
    path("handler/details/<int:pk>", EpaSiteView.as_view()),
]
