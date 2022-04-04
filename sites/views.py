from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, Http404


def sites_dashboard(request):
    return render(request, 'sites/sites.html')
