from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, Http404
from .rcrainfo.manifest import sync_mtn
from .models import Manifest
from .emanclient import pull_manifest


def trak_home(request):
    manifests = Manifest.objects.filter()
    return render(request, 'trak/trak.html', {'manifests': manifests})


def manifest_view(request, manifest_id):
    manifest = get_object_or_404(Manifest, pk=manifest_id)
    return render(request, 'trak/manifest.html', {'manifest': manifest})


def sync(request):
    pull_manifest()
    return HttpResponse("data")

