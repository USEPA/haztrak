from django.contrib import admin

from .models import Manifest, Handler, Site

# Register your models here.
admin.site.register(Manifest)
admin.site.register(Handler)
admin.site.register(Site)
