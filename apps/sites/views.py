from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from apps.trak.models import Manifest
from .models import EpaSite


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
    site_object = Manifest.objects.filter(generator__epaSiteId=epa_id)
    return render(request, 'sites/site_manifests.html', {'manifests': site_object})
