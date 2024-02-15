from typing import Optional

import pytest
from faker import Faker

from apps.trak.models import Manifest
from apps.wasteline.models import DotLookup, DotLookupType, WasteCode, WasteLine


@pytest.fixture
def dot_option_factory(db, faker: Faker):
    """Abstract factory for Haztrak DotLookup model"""

    def create_dot_option(
        value: Optional[str] = None,
        value_type: Optional[DotLookupType] = DotLookupType.ID,
    ) -> DotLookup:
        return DotLookup.objects.create(
            value=value or faker.pystr(max_chars=10), value_type=value_type
        )

    return create_dot_option


@pytest.fixture
def waste_code_factory(db):
    """Abstract factory for waste codes"""

    def create_waste_code(
        code: Optional[str] = "D001",
        description: Optional[str] = "IGNITABLE WASTE",
        code_type: Optional[WasteCode.CodeType] = WasteCode.CodeType.FEDERAL,
        state_id: Optional[str] = "VA",
    ) -> WasteCode:
        if code_type == WasteCode.CodeType.STATE:
            waste_code = WasteCode.objects.create(
                code=code,
                description=description,
                code_type=code_type,
                state_id=state_id,
            )
        else:
            waste_code = WasteCode.objects.create(
                code=code,
                description=description,
                code_type=code_type,
            )
        return waste_code

    return create_waste_code


@pytest.fixture
def waste_line_factory(db):
    """Abstract factory for Haztrak DotLookup model"""

    def create_waste_line(
        manifest: Manifest = None,
        dot_hazardous: Optional[bool] = True,
        quantity: Optional[dict] = None,
        line_number: Optional[int] = 1,
        br: Optional[bool] = False,
        pcb: Optional[bool] = False,
        epa_waste: Optional[bool] = True,
    ) -> WasteLine:
        return WasteLine.objects.create(
            manifest=manifest,
            dot_hazardous=dot_hazardous,
            quantity=quantity or {"units": "G", "value": 1},  # Temporary
            line_number=line_number,
            br=br,
            pcb=pcb,
            epa_waste=epa_waste,
        )

    return create_waste_line
