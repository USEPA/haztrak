from django.urls import path

from . import views

urlpatterns = [
    # manifest
    path('manifest/', views.ManifestView.as_view()),
    path('manifest/<str:mtn>', views.ManifestView.as_view()),
    # site
    path('handler/<str:epa_id>', views.HandlerView.as_view()),
    # rcrainfo integration actions
    path('rcrainfo/sync-manifest', views.PullManifest.as_view(), name='manifest-pull'),
    # other
    path('sync/<str:site_id>', views.SyncSiteManifest.as_view(), name='sync'),
    path('tran/<int:tran_id>', views.TransporterView.as_view())
]
