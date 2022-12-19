from django.contrib import admin

from .models import Address, Handler, Manifest, Site, Transporter, WasteLine, \
    RcraProfile

# Register models here.
admin.site.register(Manifest)
admin.site.register(Handler)
admin.site.register(Site)
admin.site.register(WasteLine)
admin.site.register(Transporter)
admin.site.register(Address)
admin.site.register(RcraProfile)
