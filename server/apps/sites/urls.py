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
    path("site/profile/<str:user>/sync", SyncProfileView.as_view()),
    path("site/profile/<str:user>", RcraProfileView.as_view()),
    path("site/permission/<int:pk>", RcraSitePermissionView.as_view()),
    # Site
    path("site/", SiteListView.as_view()),
    path("site/<str:epa_id>", SiteDetailView.as_view()),
    path("site/<str:epa_id>/manifest", SiteMtnListView.as_view()),
    path("site/manifest/sync", SyncSiteManifestView.as_view()),
    # RcraSite
    path("site/handler/search", RcraSiteSearchView.as_view()),
    path("site/handler/details/<int:pk>", RcraSiteView.as_view()),
]
