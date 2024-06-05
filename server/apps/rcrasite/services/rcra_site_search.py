from typing import Optional

from apps.core.services import RcraClient


class RcraSiteSearch:
    def __init__(self, rcra_client: Optional[RcraClient] = None):
        self._rcra_client = rcra_client or RcraClient()
        self._state: Optional[str] = None
        self._epa_id: Optional[str] = None

    @property
    def rcra_client(self) -> RcraClient:
        if not self._rcra_client:
            self._rcra_client = RcraClient()
        return self._rcra_client

    @rcra_client.setter
    def rcra_client(self, value) -> None:
        self._rcra_client = value

    def build_search_args(self) -> dict:
        search_params = {
            "state": self._state,
            "epaSiteId": self._epa_id,
        }
        return {k: v for k, v in search_params.items() if v is not None}

    def state(self, state: str) -> "RcraSiteSearch":
        self._state = state
        return self

    def epa_id(self, epa_id: str) -> "RcraSiteSearch":
        self._epa_id = epa_id
        return self

    def outputs(self) -> dict:
        return self.build_search_args()

    def execute(self):
        search_args = self.build_search_args()
        return self._rcra_client.search_sites(**search_args)
