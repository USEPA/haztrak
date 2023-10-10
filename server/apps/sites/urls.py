from django.urls import include, path

from apps.sites.views import (  # type: ignore
    RcraSiteView,
    SiteDetailView,
    SiteListView,
    SiteMtnListView,
    SiteSearchView,
    rcrainfo_site_search_view,
)

urlpatterns = [
    path(
        "rcra/",
        include(
            [
                path("handler/search", rcrainfo_site_search_view),
                path("handler/<int:pk>", RcraSiteView.as_view()),
            ]
        ),
    ),
    # Site
    path("site", SiteListView.as_view()),
    path("site/search", SiteSearchView.as_view()),
    path("site/<str:epa_id>", SiteDetailView.as_view()),
    path("site/<str:epa_id>/manifest", SiteMtnListView.as_view()),
]
