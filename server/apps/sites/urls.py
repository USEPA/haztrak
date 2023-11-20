from django.urls import include, path

from apps.sites.views import (  # type: ignore
    HandlerSearchView,
    HaztrakOrgSitesListView,
    HaztrakSiteListView,
    RcraSiteSearchView,
    RcraSiteView,
    SiteDetailView,
)

urlpatterns = [
    path(
        "rcra/",
        include(
            [
                path("handler/search", HandlerSearchView.as_view()),
                path("handler/<int:pk>", RcraSiteView.as_view()),
            ]
        ),
    ),
    # Site
    path("site", HaztrakSiteListView.as_view()),
    path("site/search", RcraSiteSearchView.as_view()),
    path("site/<str:epa_id>", SiteDetailView.as_view()),
    path("org/<str:org_id>/site", HaztrakOrgSitesListView.as_view()),
]
