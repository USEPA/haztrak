from django.urls import path

from . import views

urlpatterns = [
    path('manifest/', views.ManifestView.as_view()),
    path('manifest/<str:mtn>', views.ManifestView.as_view()),
    path('sync/<str:epa_id>', views.SyncSiteManifest.as_view(), name='sync'),
]
