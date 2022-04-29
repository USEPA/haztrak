from django.contrib import admin

from .models import Manifest, Handler, Site, Address

# Register your models here.
admin.site.register(Manifest)
admin.site.register(Handler)
admin.site.register(Site)
admin.site.register(Address)
