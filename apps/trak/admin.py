from django.contrib import admin

from .models import Manifest, Handler, EpaSite, Address

# Register your models here.
admin.site.register(Manifest)
admin.site.register(Handler)
admin.site.register(EpaSite)
admin.site.register(Address)
