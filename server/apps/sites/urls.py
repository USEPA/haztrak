from django.urls import path

from apps.sites.views import (
    RcraSiteSearchView,
    RcraSiteView,
    SiteDetailView,
    SiteListView,
    SiteMtnListView,
    rcrainfo_site_search_view,
)

urlpatterns = [
    # Site
    path("site", SiteListView.as_view()),
    path("site/<str:epa_id>", SiteDetailView.as_view()),
    path("site/<str:epa_id>/manifest", SiteMtnListView.as_view()),
    path("site/rcra-site/search", RcraSiteSearchView.as_view()),
    path("site/rcra-site/<int:pk>", RcraSiteView.as_view()),
    path("site/rcrainfo/search", rcrainfo_site_search_view),
]
