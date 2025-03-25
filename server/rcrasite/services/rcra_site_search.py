"""Service to search for RCRA sites using the RCRAInfo API."""

from typing import Literal

from emanifest import RcrainfoResponse

from core.services import RcraClient

SiteType = Literal["Generator", "Tsdf", "Transporter", "Broker"]


class RcraSiteSearch:
    """Search for RCRA sites using the RCRAInfo API."""

    def __init__(self, rcra_client: RcraClient | None = None):
        self._rcra_client = rcra_client or RcraClient()
        self._state: str | None = None
        self._epa_id: str | None = None
        self._site_type: str | None = None

    @property
    def rcra_client(self) -> RcraClient:
        """Return the RCRA client."""
        if not self._rcra_client:
            self._rcra_client = RcraClient()
        return self._rcra_client

    @rcra_client.setter
    def rcra_client(self, value) -> None:
        self._rcra_client = value

    def get_search_attributes(self) -> dict:
        """Return the search attributes."""
        search_params = {
            "state": self._state,
            "epa_id": self._epa_id,
            "site_type": self._site_type,
        }
        return {k: v for k, v in search_params.items() if v is not None}

    def build_search_args(self) -> dict:
        """Return the search arguments."""
        search_params = {
            "state": self._state,
            "epaSiteId": self._epa_id,
            "siteType": self._site_type,
        }
        return {k: v for k, v in search_params.items() if v is not None}

    @staticmethod
    def _validate_state(state: str) -> None:
        if not state.isalpha():
            msg = "State code must be alphabetical"
            raise ValueError(msg)
        state_code_length = 2
        if len(state) != state_code_length:
            msg = "State code must be two letters"
            raise ValueError(msg)

    def _validate_epa_id(self, epa_id: str) -> None:
        epa_id_min_length = 2
        epa_id_length = 12
        if len(epa_id) <= epa_id_min_length:
            msg = "EPA ID must be at least 2 characters"
            raise ValueError(msg)
        if len(epa_id) != epa_id_length and (self._site_type is None and self._state is None):
            msg = "EPA ID must be 12 characters"
            raise ValueError(msg)

    @staticmethod
    def _validate_site_type(site_type: SiteType) -> None:
        if site_type not in ["Generator", "Tsdf", "Transporter", "Broker"]:
            msg = "Invalid site type"
            raise ValueError(msg)

    def site_type(self, site_type: str) -> "RcraSiteSearch":
        """Set the site type."""
        self._site_type = site_type
        return self

    def state(self, state: str) -> "RcraSiteSearch":
        """Set the state."""
        self._state = state
        return self

    def epa_id(self, epa_id: str) -> "RcraSiteSearch":
        """Set the EPA ID."""
        self._epa_id = epa_id
        return self

    def outputs(self) -> dict:
        """Return the search arguments."""
        return self.build_search_args()

    def validate(self):
        """Validate the search arguments."""
        search_args = self.get_search_attributes()
        for key, value in search_args.items():
            validate_method = getattr(self, f"_validate_{key}")
            validate_method(value)
        return True

    def execute(self) -> RcrainfoResponse:
        """Execute the search."""
        self.validate()
        search_args = self.build_search_args()
        return self._rcra_client.search_sites(**search_args)
