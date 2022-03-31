from django.shortcuts import render
from django.http import HttpResponse, Http404
from .rcrainfo.manifest import sync_mtn
from .models import Manifest


# Create your views here.
def trak_home(request):
    manifests = Manifest.objects.filter()
    return render(request, 'trak/trak.html', {'manifests': manifests})


def sync(request, num):
    data = sync_mtn()
    if 1 <= num <= 3:
        return HttpResponse(data)
    else:
        raise Http404("No such section")
