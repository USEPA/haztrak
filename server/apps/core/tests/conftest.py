from datetime import datetime, timezone
from typing import Dict, List, Optional

import pytest
from faker import Faker

from apps.sites.models import RcraSiteType


@pytest.fixture
def quicker_sign_response_factory(faker: Faker):
    """
    Factory for creating dynamic quicker sign response data
    """

    def create_quicker_sign(
        mtn: List[str],
        site_id: str,
        site_type: Optional[RcraSiteType] = RcraSiteType.GENERATOR,
        printed_name: Optional[str] = None,
        sign_date: Optional[datetime] = datetime.utcnow().replace(tzinfo=timezone.utc),
        transporter_order: Optional[int] = None,
    ) -> Dict:
        sign_date_iso = sign_date.isoformat(timespec="milliseconds")
        return {
            "reportId": "5fff5aab-2172-4a28-b530-f4c42f1bfdaf",
            "date": sign_date_iso,
            "operationStatus": "Completed",
            "manifestReports": [{"manifestTrackingNumber": mtn} for mtn in mtn],
            "signerReport": {
                "printedSignatureName": printed_name or faker.name(),
                "printedSignatureDate": sign_date_iso,
                "electronicSignatureDate": sign_date_iso,
                "firstName": f"({faker.first_name()}",
                "lastName": f"{faker.last_name()}",
                "userId": f"{faker.user_name()}",
                "warnings": [],
            },
            "siteReport": {"siteId": site_id, "siteType": str(site_type.label)},
        }

    yield create_quicker_sign
