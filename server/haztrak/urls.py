"""haztrak URL Configuration

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

from django.contrib import admin
from django.urls import include, path, re_path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

# Change the Django Admin page title
admin.site.site_header = "Haztrak Admin"

urlpatterns = [
    path("admin/", admin.site.urls),
    re_path(r"^api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path(
        "api/",
        include(
            [
                path("", include("apps.manifest.urls", namespace="manifest")),
                path("", include("wasteline.urls", namespace="wasteline")),
                path("", include("apps.rcrasite.urls", namespace="rcrasite")),
                path("", include("apps.core.urls", namespace="core")),
                path("", include("apps.org.urls", namespace="org")),
                path("", include("apps.site.urls", namespace="site")),
                path("", include("apps.profile.urls", namespace="profile")),
                path("schema/", SpectacularAPIView.as_view(), name="schema"),
                path(
                    "schema/swagger-ui",
                    SpectacularSwaggerView.as_view(url_name="schema"),
                    name="swagger-ui",
                ),
                path(r"health/", include("health_check.urls")),
            ]
        ),
    ),
]
