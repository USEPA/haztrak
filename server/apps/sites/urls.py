from django.urls import path

from apps.sites.views import (
    EpaSiteSearchView,
    EpaSiteView,
    RcraProfileView,
    SiteApi,
    SiteList,
    SiteManifest,
    SitePermissionView,
    SyncProfileView,
    SyncSiteManifest,
)

urlpatterns = [
    # Rcra Profile
    path("profile/<str:user>/sync", SyncProfileView.as_view()),
    path("profile/<str:user>", RcraProfileView.as_view()),
    path("permission/<int:pk>", SitePermissionView.as_view()),
    # Site
    path("", SiteList.as_view()),
    path("<str:epa_id>", SiteApi.as_view()),
    path("<str:epa_id>/manifest", SiteManifest.as_view()),
    path("manifest/sync", SyncSiteManifest.as_view()),
    # EpaSite
    path("handler/search", EpaSiteSearchView.as_view()),
    path("handler/details/<int:pk>", EpaSiteView.as_view()),
]
