from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required


@login_required
def sites_dashboard(request):
    epa_sites = request.user.profile.epa_sites.all()
    return render(request, 'sites/sites.html', {'sites': epa_sites})
