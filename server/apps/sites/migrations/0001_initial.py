# Generated by Django 4.1.7 on 2023-04-01 20:19

import apps.sites.models.contact_models
from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Address",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("street_number", models.CharField(blank=True, max_length=12, null=True)),
                ("address1", models.CharField(max_length=50, verbose_name="address 1")),
                (
                    "address2",
                    models.CharField(
                        blank=True,
                        default=None,
                        max_length=50,
                        null=True,
                        verbose_name="address 2",
                    ),
                ),
                ("city", models.CharField(blank=True, max_length=25, null=True)),
                (
                    "state",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("AK", "Alaska"),
                            ("AL", "Alabama"),
                            ("AP", "Armed Forces Pacific"),
                            ("AR", "Arkansas"),
                            ("AZ", "Arizona"),
                            ("CA", "California"),
                            ("CO", "Colorado"),
                            ("CT", "Connecticut"),
                            ("DC", "Washington DC"),
                            ("DE", "Delaware"),
                            ("FL", "Florida"),
                            ("GA", "Georgia"),
                            ("GU", "Guam"),
                            ("HI", "Hawaii"),
                            ("IA", "Iowa"),
                            ("ID", "Idaho"),
                            ("IL", "Illinois"),
                            ("IN", "Indiana"),
                            ("KS", "Kansas"),
                            ("KY", "Kentucky"),
                            ("LA", "Louisiana"),
                            ("MA", "Massachusetts"),
                            ("MD", "Maryland"),
                            ("ME", "Maine"),
                            ("MI", "Michigan"),
                            ("MN", "Minnesota"),
                            ("MO", "Missouri"),
                            ("MS", "Mississippi"),
                            ("MT", "Montana"),
                            ("NC", "North Carolina"),
                            ("ND", "North Dakota"),
                            ("NE", "Nebraska"),
                            ("NH", "New Hampshire"),
                            ("NJ", "New Jersey"),
                            ("NM", "New Mexico"),
                            ("NV", "Nevada"),
                            ("NY", "New York"),
                            ("OH", "Ohio"),
                            ("OK", "Oklahoma"),
                            ("OR", "Oregon"),
                            ("PA", "Pennsylvania"),
                            ("PR", "Puerto Rico"),
                            ("RI", "Rhode Island"),
                            ("SC", "South Carolina"),
                            ("SD", "South Dakota"),
                            ("TN", "Tennessee"),
                            ("TX", "Texas"),
                            ("UT", "Utah"),
                            ("VA", "Virginia"),
                            ("VI", "Virgin Islands"),
                            ("VT", "Vermont"),
                            ("WA", "Washington"),
                            ("WI", "Wisconsin"),
                            ("WV", "West Virginia"),
                            ("WY", "Wyoming"),
                            ("XA", "REGION 01 PURVIEW"),
                            ("XB", "REGION 02 PURVIEW"),
                            ("XC", "REGION 03 PURVIEW"),
                            ("XD", "REGION 04 PURVIEW"),
                            ("XE", "REGION 05 PURVIEW"),
                            ("XF", "REGION 06 PURVIEW"),
                            ("XG", "REGION 07 PURVIEW"),
                            ("XH", "REGION 08 PURVIEW"),
                            ("XI", "REGION 09 PURVIEW"),
                            ("XJ", "REGION 10 PURVIEW"),
                        ],
                        max_length=3,
                        null=True,
                    ),
                ),
                (
                    "country",
                    models.CharField(
                        blank=True,
                        choices=[("US", "United States"), ("MX", "Mexico"), ("CA", "Canada")],
                        max_length=3,
                        null=True,
                    ),
                ),
                ("zip", models.CharField(blank=True, max_length=5, null=True)),
            ],
            options={
                "ordering": ["address1"],
            },
        ),
        migrations.CreateModel(
            name="Contact",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("first_name", models.CharField(blank=True, max_length=38, null=True)),
                ("middle_initial", models.CharField(blank=True, max_length=1, null=True)),
                ("last_name", models.CharField(blank=True, max_length=38, null=True)),
                ("email", models.EmailField(blank=True, max_length=254, null=True)),
                ("company_name", models.CharField(blank=True, max_length=80, null=True)),
            ],
            options={
                "ordering": ["first_name"],
            },
        ),
        migrations.CreateModel(
            name="EpaProfile",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("rcra_api_key", models.CharField(blank=True, max_length=128, null=True)),
                ("rcra_api_id", models.CharField(blank=True, max_length=128, null=True)),
                ("rcra_username", models.CharField(blank=True, max_length=128, null=True)),
                ("phone_number", models.CharField(blank=True, max_length=15, null=True)),
                ("email", models.EmailField(max_length=254)),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL
                    ),
                ),
            ],
            options={
                "ordering": ["rcra_username"],
            },
        ),
        migrations.CreateModel(
            name="EpaSite",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                (
                    "site_type",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("Tsdf", "Tsdf"),
                            ("Generator", "Generator"),
                            ("Transporter", "Transporter"),
                            ("Broker", "Broker"),
                        ],
                        max_length=20,
                        null=True,
                    ),
                ),
                (
                    "epa_id",
                    models.CharField(max_length=25, unique=True, verbose_name="EPA ID number"),
                ),
                ("name", models.CharField(max_length=200)),
                ("modified", models.BooleanField(blank=True, null=True)),
                ("registered", models.BooleanField(blank=True, null=True)),
                (
                    "gis_primary",
                    models.BooleanField(
                        blank=True, default=False, null=True, verbose_name="GIS primary"
                    ),
                ),
                (
                    "can_esign",
                    models.BooleanField(
                        blank=True, null=True, verbose_name="can electronically sign"
                    ),
                ),
                (
                    "limited_esign",
                    models.BooleanField(
                        blank=True, null=True, verbose_name="limited electronic signing ability"
                    ),
                ),
                (
                    "registered_emanifest_user",
                    models.BooleanField(
                        blank=True,
                        default=False,
                        null=True,
                        verbose_name="has registered e-manifest user",
                    ),
                ),
                (
                    "contact",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="sites.contact",
                        verbose_name="contact information",
                    ),
                ),
            ],
            options={
                "ordering": ["epa_id"],
            },
        ),
        migrations.CreateModel(
            name="Site",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        max_length=200,
                        validators=[
                            django.core.validators.MinValueValidator(
                                2, "site aliases must be longer than 2 characters"
                            )
                        ],
                        verbose_name="site alias",
                    ),
                ),
                (
                    "last_rcra_sync",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="last sync with RCRAInfo"
                    ),
                ),
                (
                    "epa_site",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="sites.epasite",
                        verbose_name="epa_site",
                    ),
                ),
            ],
            options={
                "ordering": ["epa_site__epa_id"],
            },
        ),
        migrations.CreateModel(
            name="SitePhone",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("number", apps.sites.models.contact_models.SitePhoneNumber(max_length=12)),
                ("extension", models.CharField(blank=True, max_length=6, null=True)),
            ],
            options={
                "ordering": ["number"],
            },
        ),
        migrations.CreateModel(
            name="SitePermission",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("site_manager", models.BooleanField(default=False)),
                (
                    "annual_report",
                    models.CharField(
                        choices=[
                            ("Certifier", "Certifier"),
                            ("Preparer", "Preparer"),
                            ("Viewer", "Viewer"),
                        ],
                        max_length=12,
                    ),
                ),
                (
                    "biennial_report",
                    models.CharField(
                        choices=[
                            ("Certifier", "Certifier"),
                            ("Preparer", "Preparer"),
                            ("Viewer", "Viewer"),
                        ],
                        max_length=12,
                    ),
                ),
                (
                    "e_manifest",
                    models.CharField(
                        choices=[
                            ("Certifier", "Certifier"),
                            ("Preparer", "Preparer"),
                            ("Viewer", "Viewer"),
                        ],
                        max_length=12,
                    ),
                ),
                (
                    "my_rcra_id",
                    models.CharField(
                        choices=[
                            ("Certifier", "Certifier"),
                            ("Preparer", "Preparer"),
                            ("Viewer", "Viewer"),
                        ],
                        max_length=12,
                    ),
                ),
                (
                    "wiets",
                    models.CharField(
                        choices=[
                            ("Certifier", "Certifier"),
                            ("Preparer", "Preparer"),
                            ("Viewer", "Viewer"),
                        ],
                        max_length=12,
                    ),
                ),
                (
                    "profile",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="site_permission",
                        to="sites.epaprofile",
                    ),
                ),
                (
                    "site",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="sites.site"
                    ),
                ),
            ],
            options={
                "verbose_name": "EPA Site Permission",
                "ordering": ["site__epa_site__epa_id"],
            },
        ),
        migrations.AddField(
            model_name="epasite",
            name="emergency_phone",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="sites.sitephone",
            ),
        ),
        migrations.AddField(
            model_name="epasite",
            name="mail_address",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="mail_address",
                to="sites.address",
            ),
        ),
        migrations.AddField(
            model_name="epasite",
            name="site_address",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="site_address",
                to="sites.address",
            ),
        ),
        migrations.AddField(
            model_name="contact",
            name="phone",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="sites.sitephone",
            ),
        ),
    ]
