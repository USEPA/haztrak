from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from django.views import View
from apps.trak.models import Manifest


class Home(View):
    template = 'home/home.html'

    def get(self, request: HttpRequest) -> HttpResponse:
        # TODO: filter manifest by sites that the user has access to
        #  requires modification to the manifest model (tying a manifest to a site)
        manifest_count = Manifest.objects.filter(status='InTransit').count()
        return render(request, self.template, {'in_transit': manifest_count})


class AboutHaztrak(View):
    template = 'home/about.html'

    def get(self, request):
        return render(request, self.template)
