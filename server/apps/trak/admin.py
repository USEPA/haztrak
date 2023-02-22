from django.contrib import admin

from .models import (
    Address,
    Contact,
    EpaPhone,
    Handler,
    Manifest,
    RcraProfile,
    Site,
    SitePermission,
    Transporter,
    WasteLine,
)

# Register models here.
admin.site.register(Manifest)
admin.site.register(Handler)
admin.site.register(Site)
admin.site.register(WasteLine)
admin.site.register(Transporter)
admin.site.register(Address)
admin.site.register(RcraProfile)
admin.site.register(EpaPhone)
admin.site.register(Contact)
admin.site.register(SitePermission)
