from rest_framework.generics import ListAPIView

from apps.trak.models import WasteCode
from apps.trak.serializers import WasteCodeSerializer


class FederalWasteCodesView(ListAPIView):
    """
    Endpoint for retrieving EPA Federal waste codes
    """

    serializer_class = WasteCodeSerializer
    queryset = WasteCode.federal.all()


class StateWasteCodesView(ListAPIView):
    """
    Endpoint for retrieving State waste codes
    """

    serializer_class = WasteCodeSerializer
    queryset = WasteCode.state.all()
