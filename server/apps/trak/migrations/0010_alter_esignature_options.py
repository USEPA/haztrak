# Generated by Django 4.1.7 on 2023-03-30 23:49

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("trak", "0009_alter_contact_options_alter_manifest_options_and_more"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="esignature",
            options={"ordering": ["sign_date"], "verbose_name": "e-Signature"},
        ),
    ]