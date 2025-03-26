"""
haztrak URL Configuration.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/

Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the 'include()' function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))

"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

# Change the Django Admin page title
admin.site.site_header = "Haztrak Admin"

urlpatterns = [
    path("admin/", admin.site.urls),
    re_path(
        r"^api-auth/",
        include("rest_framework.urls", namespace="rest_framework"),
    ),  # Browsable API authentication
    path(
        "api/",
        include(
            [
                path("auth/registration/", include("dj_rest_auth.registration.urls")),
                path("auth/", include("dj_rest_auth.urls")),
                path("", include("manifest.urls", namespace="manifest")),
                path("", include("wasteline.urls", namespace="wasteline")),
                path("", include("rcrasite.urls", namespace="rcrasite")),
                path("", include("core.urls", namespace="core")),
                path("", include("org.urls", namespace="org")),
                path("", include("profile.urls", namespace="profile")),
                path("schema/", SpectacularAPIView.as_view(), name="schema"),
                path(
                    "schema/swagger-ui",
                    SpectacularSwaggerView.as_view(url_name="schema"),
                    name="swagger-ui",
                ),
                path(r"health/", include("health_check.urls")),
            ],
        ),
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
