from django.urls import path

from .views import (HandlerSearch, HandlerView, ManifestView, SiteApi,
                    SiteList, SiteManifest)

urlpatterns = [
    # Manifest
    path('manifest/<str:mtn>',
         ManifestView.as_view(
             {'get': 'retrieve', 'post': 'create', 'delete': 'destroy'})),
    # Site
    path('site/', SiteList.as_view()),
    path('site/<str:epa_id>', SiteApi.as_view()),
    path('site/<str:epa_id>/manifest', SiteManifest.as_view()),
    # Handler
    path('handler/search', HandlerSearch.as_view()),
    path('handler/details/<int:pk>', HandlerView.as_view()),
]
