from datetime import datetime
from typing import Literal, Optional, get_args

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
    def __init__(self):
        self.state_code: Optional[str] = None
        self.site_id: Optional[str] = None
        self.status: Optional[EmanifestStatus] = None
        self.site_type: Optional[SiteType] = None
        self.date_type: Optional[DateType] = None
        self.start_date: Optional[datetime] = None
        self.end_date: Optional[datetime] = None
        self.correction_request_status: Optional[CorrectionRequestStatus] = None

    @staticmethod
    def __validate_literal(value, literal) -> bool:
        return value in get_args(literal)

    @staticmethod
    def _valid_state_code(state_code) -> bool:
        return len(state_code) == 2 and state_code.isalpha()

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

    def add_state_code(self, state: str):
        if not self._valid_state_code(state):
            raise ValueError("Invalid State code")
        self.state_code = state
        return self

    def add_site_id(self, site_id: str):
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
        self.start_date = start_date
        return self

    def add_end_date(self, end_date: datetime = None):
        self.end_date = end_date
        return self
