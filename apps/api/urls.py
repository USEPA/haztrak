from django.urls import path

from . import views

urlpatterns = [
    # manifest
    path('manifest/', views.ManifestView.as_view()),
    path('manifest/<str:mtn>', views.ManifestView.as_view()),
    # site
    path('handler/<str:site_id>', views.HandlerView.as_view()),
    # other
    path('sync/<str:site_id>', views.SyncSiteManifest.as_view(), name='sync'),
    path('tran/<int:tran_id>', views.TransporterView.as_view())
]
