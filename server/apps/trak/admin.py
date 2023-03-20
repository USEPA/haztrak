from django.contrib import admin

from .models import (
    Address,
    Contact,
    EpaPhone,
    ESignature,
    Handler,
    Manifest,
    ManifestHandler,
    RcraProfile,
    Signer,
    Site,
    SitePermission,
    Transporter,
    WasteCode,
    WasteLine,
)

# Register models here.
admin.site.register(Address)
admin.site.register(Contact)
admin.site.register(EpaPhone)
admin.site.register(ESignature)
admin.site.register(Handler)
admin.site.register(Manifest)
admin.site.register(ManifestHandler)
admin.site.register(RcraProfile)
admin.site.register(Signer)
admin.site.register(Site)
admin.site.register(SitePermission)
admin.site.register(Transporter)
admin.site.register(WasteCode)
admin.site.register(WasteLine)
