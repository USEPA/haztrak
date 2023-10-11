# Generated by Django 4.2.5 on 2023-10-11 00:01

from django.db import migrations

from apps.trak.models import DotOption
from apps.trak.models.waste_models import DotOptionType


def populate_dot_packing_groups(apps, schema_editor):
    # WasteCode = apps.get_model("trak", "WasteCode")

    # Replace this with your logic to fetch state waste codes from RCRAInfo
    packing_groups = [
        {"value": "I", "value_type": DotOptionType.GROUP},
        {"value": "II", "value_type": DotOptionType.GROUP},
        {"value": "III", "value_type": DotOptionType.GROUP},
    ]

    for group in packing_groups:
        DotOption.objects.create(**group)


def populate_dot_hazard_classes(apps, schema_editor):
    # WasteCode = apps.get_model("trak", "WasteCode")

    # Replace this with your logic to fetch state waste codes from RCRAInfo
    packing_groups = [
        {"value": "I", "value_type": DotOptionType.GROUP},
        {"value": "II", "value_type": DotOptionType.GROUP},
        {"value": "III", "value_type": DotOptionType.GROUP},
        {"value": "3", "value_type": DotOptionType.CLASS},
        {"value": "5.1", "value_type": DotOptionType.CLASS},
        {"value": "4.1", "value_type": DotOptionType.CLASS},
        {"value": "1.5D", "value_type": DotOptionType.CLASS},
        {"value": "1.1D", "value_type": DotOptionType.CLASS},
        {"value": "1.2G", "value_type": DotOptionType.CLASS},
        {"value": "1.3G", "value_type": DotOptionType.CLASS},
        {"value": "1.4G", "value_type": DotOptionType.CLASS},
        {"value": "1.3J", "value_type": DotOptionType.CLASS},
        {"value": "1.2H", "value_type": DotOptionType.CLASS},
        {"value": "1.3H", "value_type": DotOptionType.CLASS},
        {"value": "9", "value_type": DotOptionType.CLASS},
        {"value": "1.2K", "value_type": DotOptionType.CLASS},
        {"value": "1.3K", "value_type": DotOptionType.CLASS},
        {"value": "1.6N", "value_type": DotOptionType.CLASS},
        {"value": "1.4S", "value_type": DotOptionType.CLASS},
        {"value": "1.4B", "value_type": DotOptionType.CLASS},
        {"value": "1.4C", "value_type": DotOptionType.CLASS},
        {"value": "1.4D", "value_type": DotOptionType.CLASS},
        {"value": "1.1L", "value_type": DotOptionType.CLASS},
        {"value": "1.2L", "value_type": DotOptionType.CLASS},
        {"value": "1.3L", "value_type": DotOptionType.CLASS},
        {"value": "8", "value_type": DotOptionType.CLASS},
        {"value": "1.1C", "value_type": DotOptionType.CLASS},
        {"value": "1.1E", "value_type": DotOptionType.CLASS},
        {"value": "1.1F", "value_type": DotOptionType.CLASS},
        {"value": "1.2C", "value_type": DotOptionType.CLASS},
        {"value": "1.2D", "value_type": DotOptionType.CLASS},
        {"value": "1.2E", "value_type": DotOptionType.CLASS},
        {"value": "1.2F", "value_type": DotOptionType.CLASS},
        {"value": "1.3C", "value_type": DotOptionType.CLASS},
        {"value": "1.4E", "value_type": DotOptionType.CLASS},
        {"value": "1.4F", "value_type": DotOptionType.CLASS},
        {"value": "6.1", "value_type": DotOptionType.CLASS},
        {"value": "1.1G", "value_type": DotOptionType.CLASS},
        {"value": "1.1A", "value_type": DotOptionType.CLASS},
        {"value": "6.2", "value_type": DotOptionType.CLASS},
        {"value": "1.1J", "value_type": DotOptionType.CLASS},
        {"value": "1.2J", "value_type": DotOptionType.CLASS},
        {"value": "1.1B", "value_type": DotOptionType.CLASS},
        {"value": "1.2B", "value_type": DotOptionType.CLASS},
        {"value": "Comb liq", "value_type": DotOptionType.CLASS},
        {"value": "5.2", "value_type": DotOptionType.CLASS},
        {"value": "7", "value_type": DotOptionType.CLASS},
        {"value": "2.1", "value_type": DotOptionType.CLASS},
        {"value": "2.2", "value_type": DotOptionType.CLASS},
        {"value": "ORM-D", "value_type": DotOptionType.CLASS},
        {"value": "2.3", "value_type": DotOptionType.CLASS},
        {"value": "4.2", "value_type": DotOptionType.CLASS},
        {"value": "4.3", "value_type": DotOptionType.CLASS},
    ]

    for group in packing_groups:
        DotOption.objects.create(**group)


class Migration(migrations.Migration):
    dependencies = [
        ("trak", "0007_dot_id_numbers"),
    ]

    operations = [
        migrations.RunPython(populate_dot_packing_groups),
        migrations.RunPython(populate_dot_hazard_classes),
    ]
