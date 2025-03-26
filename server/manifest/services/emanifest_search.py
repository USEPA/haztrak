"""Emanifest search service."""

from datetime import UTC, datetime, timedelta, timezone
from typing import Literal, Optional, get_args

from core.services import RcraClient

EmanifestStatus = Literal[
    "Pending",
    "Scheduled",
    "InTransit",
    "ReadyForSignature",
    "Signed",
    "SignedComplete",
    "UnderCorrection",
    "Corrected",
]

SiteType = Literal["Generator", "Tsdf", "Transporter", "RejectionInfo_AlternateTsdf"]

CorrectionRequestStatus = Literal["NotSent", "Sent", "IndustryResponded", "Cancelled"]

DateType = Literal["CertifiedDate", "ReceivedDate", "ShippedDate", "UpdatedDate"]

RCRAINFO_DATE_FORMAT = "%Y-%m-%dT%H:%M:%S.%fZ"


class EmanifestSearch:
    """Emanifest search class."""

    def __init__(self, rcra_client: RcraClient | None = None):
        self._rcra_client = rcra_client or RcraClient()
        self.state_code: str | None = None
        self.site_id: str | None = None
        self.status: EmanifestStatus | None = None
        self.site_type: SiteType | None = None
        self.date_type: DateType | None = None
        self.start_date: datetime | None = None
        self.end_date: datetime | None = None
        self.correction_request_status: CorrectionRequestStatus | None = None

    @property
    def rcra_client(self):
        """Return the RCRA client."""
        if not self._rcra_client:
            self._rcra_client = RcraClient()
        return self._rcra_client

    @rcra_client.setter
    def rcra_client(self, value):
        self._rcra_client = value

    @staticmethod
    def __validate_literal(value, literal) -> bool:
        return value in get_args(literal)

    @staticmethod
    def _valid_state_code(state_code) -> bool:
        state_code_len = 2
        return len(state_code) == state_code_len and state_code.isalpha()

    @staticmethod
    def _valid_site_id(site_id: str) -> bool:
        state_code_len = 2
        return len(site_id) > state_code_len and site_id.isalnum()

    @classmethod
    def _emanifest_status(cls, status) -> bool:
        return cls.__validate_literal(status, EmanifestStatus)

    @classmethod
    def _emanifest_site_type(cls, site_type) -> bool:
        return cls.__validate_literal(site_type, SiteType)

    @classmethod
    def _emanifest_date_type(cls, date_type) -> bool:
        return cls.__validate_literal(date_type, DateType)

    @classmethod
    def _emanifest_correction_request_status(cls, correction_request_status) -> bool:
        return cls.__validate_literal(correction_request_status, CorrectionRequestStatus)

    def _date_or_three_years_past(self, start_date: datetime | None) -> str:
        date = (
            start_date.replace(tzinfo=UTC).strftime(self.rcra_client.datetime_format)
            if start_date
            else (
                datetime.now(UTC)
                - timedelta(
                    minutes=60  # 60 seconds/1minutes
                    * 24  # 24 hours/1day
                    * 30  # 30 days/1month
                    * 36,  # 36 months/3years = 3/years
                )
            ).strftime(self.rcra_client.datetime_format)
        )
        return self.__format_rcrainfo_date_string(date)

    def _date_or_now(self, end_date: datetime | None) -> str:
        date = (
            end_date.replace(tzinfo=UTC).strftime(self.rcra_client.datetime_format)
            if end_date
            else datetime.now(UTC).strftime(self.rcra_client.datetime_format)
        )
        return self.__format_rcrainfo_date_string(date)

    @staticmethod
    def __format_rcrainfo_date_string(str_date: str) -> str:
        return str_date[:-8] + "Z"

    def build_search_args(self):
        """Build the search parameters for the manifest search."""
        search_params = {
            "stateCode": self.state_code,
            "siteId": self.site_id,
            "status": self.status,
            "dateType": self.date_type,
            "siteType": self.site_type,
            "endDate": self.end_date,
            "startDate": self.start_date,
        }
        return {k: v for k, v in search_params.items() if v is not None}

    def add_state_code(self, state: str):
        """Add state code to search."""
        if not self._valid_state_code(state):
            msg = "Invalid State code"
            raise ValueError(msg)
        self.state_code = state
        return self

    def add_site_id(self, site_id: str):
        """Add site ID to search."""
        if not self._valid_site_id(site_id):
            msg = "Invalid Site ID"
            raise ValueError(msg)
        self.site_id = site_id
        return self

    def add_status(self, status: EmanifestStatus):
        """Add status to search."""
        if not self._emanifest_status(status):
            msg = "Invalid Status"
            raise ValueError(msg)
        self.status = status
        return self

    def add_site_type(self, site_type: SiteType):
        """Add site type to search."""
        if not self._emanifest_site_type(site_type):
            msg = "Invalid Site Type"
            raise ValueError(msg)
        self.site_type = site_type
        return self

    def add_date_type(self, date_type: DateType):
        """Add Date Type."""
        if not self._emanifest_date_type(date_type):
            msg = "Invalid Date Type"
            raise ValueError(msg)
        self.date_type = date_type
        return self

    def add_correction_request_status(self, correction_request_status: CorrectionRequestStatus):
        """Correction Request Status."""
        if not self._emanifest_correction_request_status(correction_request_status):
            msg = "Invalid Correction Request Status"
            raise ValueError(msg)
        self.correction_request_status = correction_request_status
        return self

    def add_start_date(self, start_date: datetime | None = None):
        """Start of date range for manifest search. Default to three years ago."""
        self.start_date = self._date_or_three_years_past(start_date)
        return self

    def add_end_date(self, end_date: datetime | None = None):
        """End of date range for manifest search. Default to now."""
        self.end_date = self._date_or_now(end_date)
        return self

    def output(self):
        """Return the current search parameters."""
        return self.build_search_args()

    def execute(self):
        """Execute the search with the current search parameters."""
        search_args = self.build_search_args()
        return self._rcra_client.search_mtn(**search_args)
