from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, Http404
from .rcrainfo.manifest import sync_mtn
from .models import Manifest


def trak_home(request):
    manifests = Manifest.objects.filter()
    return render(request, 'trak/trak.html', {'manifests': manifests})


def manifest_view(request, manifest_id):
    manifest = get_object_or_404(Manifest, pk=manifest_id)
    return render(request, 'trak/manifest.html', {'manifest': manifest})


def sync(request, num):
    data = sync_mtn()
    if 1 <= num <= 3:
        return HttpResponse(data)
    else:
        raise Http404("No such section")
