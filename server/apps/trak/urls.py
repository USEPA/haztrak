from django.urls import path

from . import views

urlpatterns = [

    # Manifest
    path('manifest/', views.ManifestView.as_view()),
    path('manifest/<str:mtn>', views.ManifestView.as_view()),
    # Site
    path('site/', views.SiteAPI.as_view()),
    path('site/<str:epa_id>', views.SiteAPI.as_view()),
    path('site/<str:epa_id>/manifest', views.SiteManifest.as_view()),
]
