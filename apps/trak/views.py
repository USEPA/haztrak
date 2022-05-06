from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Manifest
from .models import Site


@login_required
def manifest_view(request, manifest_id):
    try:
        manifest = Manifest.objects.get(id=manifest_id)
        return render(request, 'trak/manifest.html', {'manifest': manifest})
    except Manifest.DoesNotExist:
        return render(request, '404.html', status=404)


@login_required
def manifests_in_transit(request):
    manifests = Manifest.objects.filter(status='InTransit')
    return render(request, 'trak/site_manifests.html', {'manifests': manifests})


@login_required
def sites_dashboard(request):
    epa_sites = request.user.profile.epa_sites.all()
    return render(request, 'trak/sites.html', {'sites': epa_sites})


@login_required
def sites_details(request, id_number):
    try:
        site = Site.objects.get(epa_site__epa_id=id_number)
        return render(request, 'trak/site_details.html', {'site': site})
    except Site.DoesNotExist:
        return render(request, '404.html', status=404)


@login_required
def site_manifests(request, epa_id):
    try:
        manifests = Manifest.objects.filter(generator__epa_id=epa_id)
        site = Site.objects.get(epa_site__epa_id=epa_id)
        return render(request, 'trak/site_manifests.html',
                      {'site': site, 'manifests': manifests})
    except Site.DoesNotExist:
        return render(request, '404.html', status=404)
