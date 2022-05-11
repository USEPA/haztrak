from django.contrib import admin

from .models import Handler, Manifest, Site

# Register your models here.
admin.site.register(Manifest)
admin.site.register(Handler)
admin.site.register(Site)
