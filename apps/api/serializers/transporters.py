from apps.trak.models import Transporter

from . import HandlerSerializer


class TransporterSerializer(HandlerSerializer):
    class Meta:
        model = Transporter
        fields = '__all__'
        depth = 3
