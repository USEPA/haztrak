from datetime import UTC, datetime, timedelta, timezone
from typing import Literal, Optional, get_args

from apps.core.services import RcrainfoService

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


class EmanifestSearch:
    def __init__(self, rcra_client: Optional[RcrainfoService] = None):
        self._rcra_client = rcra_client or RcrainfoService()
        self.state_code: Optional[str] = None
        self.site_id: Optional[str] = None
        self.status: Optional[EmanifestStatus] = None
        self.site_type: Optional[SiteType] = None
        self.date_type: Optional[DateType] = None
        self.start_date: Optional[datetime] = None
        self.end_date: Optional[datetime] = None
        self.correction_request_status: Optional[CorrectionRequestStatus] = None

    @property
    def rcra_client(self):
        if not self._rcra_client:
            self._rcra_client = RcrainfoService()
        return self._rcra_client

    @rcra_client.setter
    def rcra_client(self, value):
        self._rcra_client = value

    @staticmethod
    def __validate_literal(value, literal) -> bool:
        return value in get_args(literal)

    @staticmethod
    def _valid_state_code(state_code) -> bool:
        return len(state_code) == 2 and state_code.isalpha()

    @staticmethod
    def _valid_site_id(site_id: str) -> bool:
        return len(site_id) > 2 and site_id.isalnum()

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

    def _date_or_three_years_past(self, start_date: Optional[datetime]) -> str:
        return (
            start_date.replace(tzinfo=timezone.utc).strftime(self.rcra_client.datetime_format)
            if start_date
            else (
                datetime.now(UTC)
                - timedelta(
                    minutes=60  # 60 seconds/1minutes
                    * 24  # 24 hours/1day
                    * 30  # 30 days/1month
                    * 36  # 36 months/3years = 3/years
                )
            ).strftime(self.rcra_client.datetime_format)
        )

    def _date_or_now(self, end_date: Optional[datetime]) -> str:
        return (
            end_date.replace(tzinfo=timezone.utc).strftime(self.rcra_client.datetime_format)
            if end_date
            else datetime.now(UTC).strftime(self.rcra_client.datetime_format)
        )

    def build_search_args(self):
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
        if not self._valid_state_code(state):
            raise ValueError("Invalid State code")
        self.state_code = state
        return self

    def add_site_id(self, site_id: str):
        if not self._valid_site_id(site_id):
            raise ValueError("Invalid Site ID")
        self.site_id = site_id
        return self

    def add_status(self, status: EmanifestStatus):
        if not self._emanifest_status(status):
            raise ValueError("Invalid Status")
        self.status = status
        return self

    def add_site_type(self, site_type: SiteType):
        if not self._emanifest_site_type(site_type):
            raise ValueError("Invalid Site Type")
        self.site_type = site_type
        return self

    def add_date_type(self, date_type: DateType):
        if not self._emanifest_date_type(date_type):
            raise ValueError("Invalid Date Type")
        self.date_type = date_type
        return self

    def add_correction_request_status(self, correction_request_status: CorrectionRequestStatus):
        if not self._emanifest_correction_request_status(correction_request_status):
            raise ValueError("Invalid Correction Request Status")
        self.correction_request_status = correction_request_status
        return self

    def add_start_date(self, start_date: datetime = None):
        """Start of date range for manifest search. Default to three years ago."""
        self.start_date = self._date_or_three_years_past(start_date)
        return self

    def add_end_date(self, end_date: datetime = None):
        """End of date range for manifest search. Default to now."""
        self.end_date = self._date_or_now(end_date)
        return self

    def execute(self):
        search_args = self.build_search_args()
        return self._rcra_client.search_mtn(**search_args)
