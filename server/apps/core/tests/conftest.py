from datetime import datetime, timezone
from typing import Dict, List, Optional

import pytest
from django.contrib.contenttypes.models import ContentType
from faker import Faker

from apps.core.models import Permission
from apps.rcrasite.models import RcraSiteType


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

    return create_quicker_sign


@pytest.fixture
def permission_factory(faker: Faker):
    """
    Factory for creating dynamic permission data
    """

    def create_permission(
        name: str = faker.word(),
        content_type_id: int = faker.random_int(min=1),
    ) -> Permission:
        content_type = ContentType.objects.create(app_label=faker.word(), model=faker.word())
        return Permission.objects.create(
            name=name,
            content_type=content_type,
            content_type_id=content_type_id,
        )

    return create_permission
