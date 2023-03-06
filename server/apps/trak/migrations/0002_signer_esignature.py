# Generated by Django 4.1.7 on 2023-03-03 22:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("trak", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Signer",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("rcra_user_id", models.CharField(blank=True, max_length=100, null=True)),
                ("first_name", models.CharField(blank=True, max_length=38, null=True)),
                ("middle_initial", models.CharField(blank=True, max_length=1, null=True)),
                ("last_name", models.CharField(blank=True, max_length=38, null=True)),
                ("email", models.CharField(blank=True, max_length=38, null=True)),
                ("company_name", models.CharField(blank=True, max_length=80, null=True)),
                (
                    "contact_type",
                    models.CharField(
                        blank=True,
                        choices=[("EM", "Email"), ("VO", "Voice"), ("TX", "Text")],
                        max_length=2,
                        null=True,
                    ),
                ),
                (
                    "signer_role",
                    models.CharField(
                        choices=[
                            ("IN", "Industry"),
                            ("PP", "Ppc"),
                            ("EP", "Epa"),
                            ("ST", "State"),
                        ],
                        max_length=10,
                        null=True,
                    ),
                ),
                (
                    "phone",
                    models.ForeignKey(
                        null=True, on_delete=django.db.models.deletion.CASCADE, to="trak.epaphone"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="ESignature",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("sign_date", models.DateTimeField(blank=True, null=True)),
                ("cromerr_activity_id", models.CharField(blank=True, max_length=100, null=True)),
                ("cromerr_document_id", models.CharField(blank=True, max_length=100, null=True)),
                ("on_behalf", models.BooleanField(blank=True, default=False)),
                (
                    "signer",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="trak.signer"
                    ),
                ),
            ],
            options={
                "verbose_name": "e-Signature",
            },
        ),
    ]