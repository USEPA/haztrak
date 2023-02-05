from django.urls import include, path
from rest_framework import routers

from .views import (HandlerSearch, HandlerView, ManifestView, RcraProfileView,
                    SiteApi, SiteList, SiteManifest, SyncProfile,
                    TransporterView)
from .views.rcra_profile import SitePermissionView

manifest_router = routers.SimpleRouter()
manifest_router.register(r'manifest', ManifestView)

urlpatterns = [
    # Rcra Profile
    path('profile/<str:user>/sync', SyncProfile.as_view()),
    path('profile/<str:user>', RcraProfileView.as_view()),
    path('permission/<int:pk>', SitePermissionView.as_view()),
    # Manifest
    path('', include(manifest_router.urls)),
    # Site
    path('site/', SiteList.as_view()),
    path('site/<str:epa_id>', SiteApi.as_view()),
    path('site/<str:epa_id>/manifest', SiteManifest.as_view()),
    # Handler
    path('handler/search', HandlerSearch.as_view()),
    path('handler/details/<int:pk>', HandlerView.as_view()),
    path('transporter/<int:pk>', TransporterView.as_view()),
]
