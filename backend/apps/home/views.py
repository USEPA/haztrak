from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from django.views import View


class Home(View):
    template = 'index.html'

    def get(self, request: HttpRequest) -> HttpResponse:
        return render(request, self.template)
