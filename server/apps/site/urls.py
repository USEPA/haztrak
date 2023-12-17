from django.urls import include, path

from apps.site.views import (  # type: ignore
    GetRcraSiteView,
    HaztrakOrgSitesListView,
    HaztrakSiteListView,
    SearchHandlerView,
    SearchRcraSiteView,
    SiteDetailView,
)

urlpatterns = [
    path(
        "rcra/",
        include(
            [
                path("handler/search", SearchHandlerView.as_view()),
                path("handler/<int:pk>", GetRcraSiteView.as_view()),
            ]
        ),
    ),
    # Site
    path("site", HaztrakSiteListView.as_view()),
    path("site/search", SearchRcraSiteView.as_view()),
    path("site/<str:epa_id>", SiteDetailView.as_view()),
    path("org/<str:org_id>/site", HaztrakOrgSitesListView.as_view()),
]
