from django.contrib import admin
from .models import Manifest, ManifestSimple

# Register your models here.
admin.site.register(Manifest)
admin.site.register(ManifestSimple)
