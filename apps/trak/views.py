from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Manifest
from .models import Site


@login_required
def manifest_view(request, manifest_id):
    manifest = get_object_or_404(Manifest, pk=manifest_id)
    return render(request, 'trak/manifest.html', {'manifest': manifest})


@login_required
def manifests_in_transit(request):
    manifest = Manifest.objects.filter(status='InTransit')
    print(manifest.count())
    return render(request, 'trak/site_manifests.html', {'manifests': manifest})


@login_required
def sites_dashboard(request):
    epa_sites = request.user.profile.epa_sites.all()
    return render(request, 'trak/sites.html', {'sites': epa_sites})


@login_required
def sites_details(request, id_number):
    queryset = Site.objects.filter(epa_site__epa_id=id_number)
    site_object = get_object_or_404(queryset)
    return render(request, 'trak/site_details.html', {'site': site_object})


@login_required
def site_manifests(request, epa_id):
    manifests = Manifest.objects.filter(generator__epa_id=epa_id)
    site_data = Site.objects.filter(epa_site__epa_id=epa_id).get()
    return render(request, 'trak/site_manifests.html', {'site': site_data, 'manifests': manifests})
