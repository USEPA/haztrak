from django.shortcuts import render, get_object_or_404
from .models import EpaSite


def sites_dashboard(request):
    # sites_with_access = request.user.profile.epa_sites.filter().get()
    epa_sites = request.user.profile.epa_sites.all()
    # epa_sites = EpaSite.objects.filter(epa_id='VATESTGEN001')
    print(type(epa_sites))
    return render(request, 'sites/sites.html', {'sites': epa_sites})
