from django.contrib import admin

from .models import Manifest, Handler

# Register your models here.
admin.site.register(Manifest)
admin.site.register(Handler)
