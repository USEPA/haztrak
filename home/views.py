from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from trak.models import Manifest


@login_required
def home(request):
    manifest_count = Manifest.objects.filter(status='InTransit').count()
    return render(request, 'home/home.html', {'in_transit': manifest_count})


def about(request):
    return render(request, 'home/about.html')
