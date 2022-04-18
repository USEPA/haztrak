from django.shortcuts import render, get_object_or_404

from .models import Manifest


def trak_home(request):
    manifests = Manifest.objects.all()
    return render(request, 'trak/trak.html', {'manifests': manifests})


def manifest_view(request, manifest_id):
    manifest = get_object_or_404(Manifest, pk=manifest_id)
    return render(request, 'trak/manifest.html', {'manifest': manifest})


def manifests_in_transit(request):
    manifest = Manifest.objects.filter(status='InTransit')
    print(manifest.count())
    return render(request, 'trak/trak.html', {'manifests': manifest})
