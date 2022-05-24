from django.contrib import admin

from .models import Handler, Manifest, Site, Transporter, WasteLine

# Register models here.
admin.site.register(Manifest)
admin.site.register(Handler)
admin.site.register(Site)
admin.site.register(WasteLine)
admin.site.register(Transporter)
