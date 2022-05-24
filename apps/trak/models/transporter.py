from django.db import models

from . import Handler


class Transporter(Handler):
    order = models.IntegerField()

    def __str__(self):
        return f'{self.epa_id}'
