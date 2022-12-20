from django.urls import include, path
from rest_framework import routers

from .views import (HandlerSearch, HandlerView, ManifestView, RcraProfileView,
                    SiteApi, SiteList, SiteManifest, SyncProfile)

manifest_router = routers.SimpleRouter()
manifest_router.register(r'manifest', ManifestView)

urlpatterns = [
    # Rcra Profile
    path('profile/<str:user>', RcraProfileView.as_view()),
    path('site/sync', SyncProfile.as_view()),
    # Manifest
    path('', include(manifest_router.urls)),
    # Site
    path('site/', SiteList.as_view()),
    path('site/<str:epa_id>', SiteApi.as_view()),
    path('site/<str:epa_id>/manifest', SiteManifest.as_view()),
    # Handler
    path('handler/search', HandlerSearch.as_view()),
    path('handler/details/<int:pk>', HandlerView.as_view()),
]
