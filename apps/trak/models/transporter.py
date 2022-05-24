from django.db import models

from . import Handler, Manifest


class Transporter(Handler):
    manifest = models.ForeignKey(
        Manifest,
        related_name='transporters',
        on_delete=models.CASCADE,
    )
    order = models.IntegerField()

    def __str__(self):
        return f'{self.epa_id}'
