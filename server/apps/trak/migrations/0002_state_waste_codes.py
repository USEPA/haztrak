from django.db import migrations

from apps.trak.models.waste_models import WasteCode


def populate_state_waste_codes(apps, schema_editor):
    # WasteCode = apps.get_model("trak", "WasteCode")

    # Replace this with your logic to fetch state waste codes from RCRAInfo
    state_waste_codes = [
        {
            "code": "BCRUSH",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.VA,
            "description": "Bulb or Lamp Crusher",
        },
        {
            "code": "AK3669",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.AK,
            "description": "from br conversion",
        },
        {
            "code": "WT02",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.AK,
            "description": "from br conversion",
        },
        {
            "code": "H142",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.IL,
            "description": "Waste stored at NWL for 90 days",
        },
        {
            "code": "H143",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.IL,
            "description": "Waste stored at NWL generated prior to this year",
        },
        {
            "code": "IL01",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.IL,
            "description": "LEAKING UNDERGROUND STORAGE TANK (LUST) CONTAMINATED SOIL, SAND AND CLAY",
        },
        {
            "code": "IL02",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.IL,
            "description": "OTHER CONTAMINATED SOIL, SAND OR CLAY",
        },
        {
            "code": "IL03",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.IL,
            "description": "OTHER CONTAMINATED MATERIALS",
        },
        {
            "code": "IL04",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.IL,
            "description": "PCB1 SOLIDS (CAPACITORS, TRANSFORMER CARCASSES)",
        },
        {
            "code": "IL05",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.IL,
            "description": "PCB2 LIQUIDS (TRANSFORMER AND CAPACITOR OILS, ETC.)",
        },
        {
            "code": "IL06",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.IL,
            "description": "LAB PACKS",
        },
        {
            "code": "IL07",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.IL,
            "description": "LEACHATE",
        },
        {
            "code": "IL08",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.IL,
            "description": "ASHES, INCINERATOR OR BOILER",
        },
        {
            "code": "IL09",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.IL,
            "description": "MUNICIPAL WASTE WATER TREATMENT SLUDGES",
        },
        {
            "code": "IL10",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.IL,
            "description": "INDUSTRIAL WASTE WATER TREATMENT SLUDGES",
        },
        {
            "code": "IL11",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.IL,
            "description": "FOOD PROCESSING WASTE & OFF-SPEC FOOD PRODUCTS",
        },
        {
            "code": "IL12",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.IL,
            "description": "ANTIFREEZE",
        },
        {
            "code": "IL13",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.IL,
            "description": "WASTE/USED OIL",
        },
        {
            "code": "IL14",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.IL,
            "description": "OTHER ORGANIC LIQUIDS",
        },
        {
            "code": "IL15",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.IL,
            "description": "OTHER ORGANIC SOLIDS OR SLUDGES",
        },
        {
            "code": "IL16",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.IL,
            "description": "LIQUIDS WITH OTHER METALS",
        },
        {
            "code": "IL17",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.IL,
            "description": "SOLIDS OR SLUDGES WITH OTHER METALS",
        },
        {
            "code": "IL18",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.IL,
            "description": "OTHER INORGANIC LIQUIDS",
        },
        {
            "code": "IL19",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.IL,
            "description": "OTHER INORGANIC SOLIDS OR SLUDGES",
        },
        {
            "code": "IL20",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.IL,
            "description": "CONTAINERIZED GAS",
        },
        {
            "code": "IL21",
            "code_type": WasteCode.CodeType.STATE,
            "state_id": WasteCode.IL,
            "description": "HOUSEHOLD HAZARDOUS WASTE FROM COLLECTIONS",
        },
    ]

    for waste_code_data in state_waste_codes:
        WasteCode.objects.create(**waste_code_data)


class Migration(migrations.Migration):
    dependencies = [
        ("trak", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(populate_state_waste_codes),
    ]
