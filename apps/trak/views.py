from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.exceptions import PermissionDenied
from django.db.models import QuerySet
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from django.views import View

from .models import Manifest, Site


class Trak(LoginRequiredMixin, View):
    template_name = 'trak/manifest_table.html'
    http_method_names = ['get']

    def filter(self) -> QuerySet:
        pass


class SiteManifests(Trak):

    def get(self, request: HttpRequest, epa_id: str) -> HttpResponse:
        try:
            # ToDo the manifest model needs to have a 'site' field added to it,
            #  manifest will be filtered by this new field.
            manifests = Manifest.objects.filter(generator__epa_id=epa_id)
            site = Site.objects.get(epa_site__epa_id=epa_id)
            return render(request, self.template_name,
                          {'site': site, 'manifests': manifests})
        except Site.DoesNotExist:
            return render(request, '404.html', status=404)
        except PermissionDenied:
            return render(request, '403.html', status=403)


class ManifestDetails(Trak):
    template_name = 'trak/manifest_details.html'

    def get(self, request: HttpRequest, manifest_id: str) -> HttpResponse:
        try:
            manifest = Manifest.objects.get(id=manifest_id)
            return render(request, self.template_name, {'manifest': manifest})
        except Manifest.DoesNotExist:
            return render(request, '404.html', status=404)
        except PermissionDenied:
            return render(request, '403.html', status=403)


class ManifestInTransit(Trak):

    def get(self, request: HttpRequest) -> HttpResponse:
        try:
            manifests = Manifest.objects.filter(status='InTransit')
            return render(request, self.template_name, {'manifests': manifests})
        except Manifest.DoesNotExist:
            return render(request, '404.html', status=404)
        except PermissionDenied:
            return render(request, '403.html', status=403)


class Sites(Trak):
    template_name = 'trak/site_table.html'

    def get(self, request: HttpRequest) -> HttpResponse:
        try:
            epa_sites = request.user.profile.epa_sites.all()
            return render(request, self.template_name, {'sites': epa_sites})
        except PermissionDenied:
            return render(request, '403.html', status=403)


class SiteDetails(Trak):
    template_name = 'trak/site_details.html'

    def get(self, request: HttpRequest, id_number: int) -> HttpResponse:
        try:
            site = Site.objects.get(epa_site__epa_id=id_number)
            return render(request, self.template_name, {'site': site})
        except Site.DoesNotExist:
            return render(request, '404.html', status=404)
        except PermissionDenied:
            return render(request, '403.html', status=403)
