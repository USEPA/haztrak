from django.urls import path, include
from rest_framework import routers

from .views import (HandlerSearch, HandlerView, SiteApi, SyncProfile,
                    ProfileView, SiteList, SiteManifest, ManifestView)

manifest_router = routers.SimpleRouter()
manifest_router.register(r'manifest', ManifestView)

urlpatterns = [
    # Rcra Profile
    path('profile', ProfileView.as_view()),
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
