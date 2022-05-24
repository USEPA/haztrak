from django.db import models

from . import Handler


class Transporter(models.Model):
    order = models.IntegerField()
    handler = models.OneToOneField(
        Handler,
        on_delete=models.PROTECT,
    )

    def __str__(self):
        return f'{self.handler.epa_id}'
