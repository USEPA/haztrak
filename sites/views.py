from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import EpaSite
from trak.models import Manifest

@login_required
def sites_dashboard(request):
    epa_sites = request.user.profile.epa_sites.all()
    return render(request, 'sites/sites.html', {'sites': epa_sites})


@login_required
def sites_details(request, epa_id):
    site_object = EpaSite.objects.filter(epa_id=epa_id).get()
    return render(request, 'sites/site_details.html', {'site': site_object})


@login_required
def site_manifests(request, epa_id):
    site_object = Manifest.objects.filter(generator_id=epa_id)
    return render(request, 'sites/site_manifests.html', {'manifests': site_object})
