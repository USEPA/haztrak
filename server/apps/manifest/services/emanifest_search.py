from datetime import datetime
from typing import Literal, Optional

EmanifestStatus = Literal[
    "Pending",
    "scheduled",
    "InTransit",
    "ReadyForSignature",
    "signed",
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

    def add_state_code(self, state: str = None):
        self.state_code = state if state else None
        return self

    def add_site_id(self, site_id: str = None):
        self.site_id = site_id if site_id else None
        return self

    def add_status(self, status: EmanifestStatus = None):
        self.status = status if status else None
        return self

    def add_site_type(self, site_type: SiteType = None):
        self.site_type = site_type if site_type else None
        return self

    def add_date_type(self, date_type: DateType = None):
        self.date_type = date_type if date_type else None
        return self
