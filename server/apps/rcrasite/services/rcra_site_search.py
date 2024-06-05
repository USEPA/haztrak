from typing import Literal, Optional

from emanifest import RcrainfoResponse

from apps.core.services import RcraClient

SiteType = Literal["Generator", "Tsdf", "Transporter", "Broker"]


class RcraSiteSearch:
    def __init__(self, rcra_client: Optional[RcraClient] = None):
        self._rcra_client = rcra_client or RcraClient()
        self._state: Optional[str] = None
        self._epa_id: Optional[str] = None
        self._site_type: Optional[str] = None

    @property
    def rcra_client(self) -> RcraClient:
        if not self._rcra_client:
            self._rcra_client = RcraClient()
        return self._rcra_client

    @rcra_client.setter
    def rcra_client(self, value) -> None:
        self._rcra_client = value

    def get_search_attributes(self) -> dict:
        search_params = {
            "state": self._state,
            "epa_id": self._epa_id,
            "site_type": self._site_type,
        }
        return {k: v for k, v in search_params.items() if v is not None}

    def build_search_args(self) -> dict:
        search_params = {
            "state": self._state,
            "epaSiteId": self._epa_id,
            "siteType": self._site_type,
        }
        return {k: v for k, v in search_params.items() if v is not None}

    def _validate_state(self, state: str) -> None:
        if not state.isalpha():
            raise ValueError("State code must be alphabetical")
        if len(state) != 2:
            raise ValueError("State code must be two letters")

    def _validate_epa_id(self, epa_id: str) -> None:
        if len(epa_id) <= 2:
            raise ValueError("EPA ID must be at least 2 characters")
        if len(epa_id) != 12 and (self._site_type is None and self._state is None):
            raise ValueError("EPA ID must be 12 characters")

    def _validate_site_type(self, site_type: SiteType) -> None:
        if site_type not in ["Generator", "Tsdf", "Transporter", "Broker"]:
            raise ValueError("Invalid site type")

    def site_type(self, site_type: str) -> "RcraSiteSearch":
        self._site_type = site_type
        return self

    def state(self, state: str) -> "RcraSiteSearch":
        self._state = state
        return self

    def epa_id(self, epa_id: str) -> "RcraSiteSearch":
        self._epa_id = epa_id
        return self

    def outputs(self) -> dict:
        return self.build_search_args()

    def validate(self):
        search_args = self.get_search_attributes()
        for key, value in search_args.items():
            validate_method = getattr(self, f"_validate_{key}")
            validate_method(value)
        return True

    def execute(self) -> RcrainfoResponse:
        self.validate()
        search_args = self.build_search_args()
        return self._rcra_client.search_sites(**search_args)
