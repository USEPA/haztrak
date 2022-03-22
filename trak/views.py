from django.shortcuts import render
from django.http import HttpResponse, Http404
# from .rcrainfo.manifest import test_manifest


# Create your views here.
def trak_home(request):
    return render(request, 'trak/trak.html')


def sync(request, num):
    # test_manifest()
    if 1 <= num <= 3:
        return HttpResponse("Hello!!!")
    else:
        raise Http404("No such section")
