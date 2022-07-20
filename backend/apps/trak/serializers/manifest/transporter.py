from apps.trak.models import Transporter
from apps.trak.serializers.handler import HandlerSerializer


class TransporterSerializer(HandlerSerializer):
    class Meta:
        model = Transporter
        fields = [
            'epaSiteId',
            'modified',
            'name',
            'siteAddress',
            'mailingAddress',
            'contact',
            'emergencyPhone',
            'electronicSignatureInfo',
            'order',
            'registered',
            'limitedEsign',
            'canEsign',
            'hasRegisteredEmanifestUser',
            'gisPrimary',
        ]
