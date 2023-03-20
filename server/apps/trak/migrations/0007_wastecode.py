# Generated by Django 4.1.7 on 2023-03-18 15:34

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("trak", "0006_alter_additionalinfo_options_alter_address_address1_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="WasteCode",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("code", models.CharField(max_length=2)),
                ("description", models.CharField(blank=True, max_length=255, null=True)),
                (
                    "code_type",
                    models.CharField(choices=[("ST", "State"), ("FD", "Federal")], max_length=2),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
    ]
