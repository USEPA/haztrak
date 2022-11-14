from django.urls import path

from . import views

urlpatterns = [
    # manifest
    path('manifest/<str:mtn>',
         views.ManifestView.as_view(
             {'get': 'retrieve', 'post': 'create', 'delete': 'destroy'})),
    # site
    path('site/', views.SiteList.as_view()),
    path('site/<str:epa_id>', views.SiteApi.as_view()),
    path('site/<str:epa_id>/manifest', views.SiteManifest.as_view()),
    # Transporter
    path('transporter/search', views.TransporterSearch.as_view()),
]
