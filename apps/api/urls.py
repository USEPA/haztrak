from django.urls import path

from . import views

urlpatterns = [
    # Authentication
    path('signup', views.SignUp.as_view()),
    # Manifest
    path('manifest/', views.ManifestView.as_view()),
    path('manifest/<str:mtn>', views.ManifestView.as_view()),
    # Site
    path('handler/<str:epa_id>', views.HandlerView.as_view()),
    # Rcrainfo integration actions
    path('rcrainfo/sync-manifest', views.PullManifest.as_view(), name='manifest-pull'),
    # Other
    path('sync/<str:site_id>', views.SyncSiteManifest.as_view(), name='sync'),
    path('tran/<int:tran_id>', views.TransporterView.as_view())
]
