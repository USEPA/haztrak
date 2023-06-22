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
    lookup_url_kwarg = "state_id"
    lookup_field = "state_id"

    def get_queryset(self):
        try:
            state_id = self.kwargs["state_id"]
            return WasteCode.state.filter(state_id=state_id)
        except KeyError:
            raise ValueError("State ID is required")
