from datetime import UTC, datetime

import pytest
from faker import Faker
from rcrasite.models import RcraSiteType


@pytest.fixture
def quicker_sign_response_factory(faker: Faker):
    """Factory for creating dynamic quicker sign response data"""

    def create_quicker_sign(
        mtn: list[str],
        site_id: str,
        site_type: RcraSiteType | None = RcraSiteType.GENERATOR,
        printed_name: str | None = None,
        sign_date: datetime | None = datetime.utcnow().replace(tzinfo=UTC),
        transporter_order: int | None = None,
    ) -> dict:
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

    return create_quicker_sign
