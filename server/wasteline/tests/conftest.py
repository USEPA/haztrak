from typing import Optional

import pytest
from faker import Faker

from manifest.models import Manifest
from wasteline.models import DotLookup, DotLookupType, WasteCode, WasteLine


@pytest.fixture
def dot_lookup_factory(db, faker: Faker):
    """Abstract factory for Haztrak DotLookup model."""

    def create_dot_option(
        value: str | None = None,
        value_type: DotLookupType | None = DotLookupType.ID,
    ) -> DotLookup:
        return DotLookup.objects.create(
            value=value or faker.pystr(max_chars=10),
            value_type=value_type,
        )

    return create_dot_option


@pytest.fixture
def waste_code_factory(db):
    """Abstract factory for waste codes."""

    def create_waste_code(
        code: str | None = "D001",
        description: str | None = "IGNITABLE WASTE",
        code_type: WasteCode.CodeType | None = WasteCode.CodeType.FEDERAL,
        state_id: str | None = "VA",
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
    """Abstract factory for Haztrak DotLookup model."""

    def create_waste_line(
        manifest: Manifest = None,
        dot_hazardous: bool | None = True,
        quantity: dict | None = None,
        line_number: int | None = 1,
        br: bool | None = False,
        pcb: bool | None = False,
        epa_waste: bool | None = True,
    ) -> WasteLine:
        """Create a waste line."""
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
