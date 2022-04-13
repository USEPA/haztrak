from django.contrib import admin
from .models import EpaSite, Address

# Register your models here.
admin.site.register(EpaSite)
admin.site.register(Address)
