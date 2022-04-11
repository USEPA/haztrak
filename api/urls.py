from django.urls import path
from . import views

urlpatterns = [
    path('manifest/', views.ManifestView.as_view()),
    path('manifest/<str:mtn>', views.ManifestView.as_view()),
]
