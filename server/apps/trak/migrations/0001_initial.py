# Generated by Django 4.1.7 on 2023-05-06 13:55

import apps.trak.models.contact_models
import apps.trak.models.manifest_models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("sites", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="AdditionalInfo",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                (
                    "original_mtn",
                    models.JSONField(
                        blank=True,
                        help_text="Original manifest tracking number of rejected manifestRegex expression validation: [0-9]{9}[A-Z]{3}",
                        null=True,
                        validators=[apps.trak.models.manifest_models.validate_mtn],
                    ),
                ),
                (
                    "new_destination",
                    models.CharField(
                        blank=True,
                        choices=[("GEN", "Generator"), ("TSD", "Tsdf")],
                        help_text="Destination of the new manifest created during rejection or residue.",
                        max_length=255,
                        null=True,
                    ),
                ),
                ("consent_number", models.CharField(blank=True, max_length=12, null=True)),
                ("comments", models.JSONField(blank=True, null=True)),
                (
                    "handling_instructions",
                    models.CharField(
                        blank=True,
                        help_text="Special Handling Instructions",
                        max_length=4000,
                        null=True,
                    ),
                ),
            ],
            options={
                "verbose_name": "Additional Info",
                "verbose_name_plural": "Additional Info",
            },
        ),
        migrations.CreateModel(
            name="Handler",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
            ],
            options={
                "ordering": ["rcra_site"],
            },
        ),
        migrations.CreateModel(
            name="Manifest",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("created_date", models.DateTimeField(auto_now=True, null=True)),
                ("update_date", models.DateTimeField(auto_now=True)),
                (
                    "mtn",
                    models.CharField(
                        default=apps.trak.models.manifest_models.draft_mtn,
                        max_length=30,
                        unique=True,
                        validators=[apps.trak.models.manifest_models.validate_mtn],
                        verbose_name="manifest Tracking Number",
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("NotAssigned", "Not Assigned"),
                            ("Pending", "Pending"),
                            ("Scheduled", "Scheduled"),
                            ("InTransit", "In Transit"),
                            ("ReadyForSignature", "Ready for Signature"),
                            ("Signed", "Signed"),
                            ("Corrected", "Corrected"),
                            ("UnderCorrection", "Under Correction"),
                            ("MtnValidationFailed", "MTN Validation Failed"),
                        ],
                        default="NotAssigned",
                        max_length=25,
                    ),
                ),
                (
                    "submission_type",
                    models.CharField(
                        choices=[
                            ("FullElectronic", "Full Electronic"),
                            ("DataImage5Copy", "Data + Image"),
                            ("Hybrid", "Hybrid"),
                            ("Image", "Image"),
                        ],
                        default="FullElectronic",
                        max_length=25,
                    ),
                ),
                ("signature_status", models.BooleanField(blank=True, null=True)),
                (
                    "origin_type",
                    models.CharField(
                        choices=[("Web", "Web"), ("Service", "Service"), ("Mail", "Mail")],
                        default="Service",
                        max_length=25,
                    ),
                ),
                ("shipped_date", models.DateTimeField(blank=True, null=True)),
                (
                    "potential_ship_date",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="potential ship date"
                    ),
                ),
                ("received_date", models.DateTimeField(blank=True, null=True)),
                ("certified_date", models.DateTimeField(blank=True, null=True)),
                ("certified_by", models.JSONField(blank=True, null=True)),
                ("broker", models.JSONField(blank=True, null=True)),
                ("rejection", models.BooleanField(blank=True, default=False)),
                (
                    "rejection_info",
                    models.JSONField(blank=True, null=True, verbose_name="Rejection Information"),
                ),
                ("discrepancy", models.BooleanField(blank=True, default=False)),
                ("residue", models.BooleanField(blank=True, default=False)),
                (
                    "residue_new_mtn",
                    models.JSONField(blank=True, default=list, verbose_name="residue new MTN"),
                ),
                (
                    "import_flag",
                    models.BooleanField(blank=True, default=False, verbose_name="import"),
                ),
                (
                    "import_info",
                    models.JSONField(blank=True, null=True, verbose_name="import information"),
                ),
                (
                    "contains_residue_or_rejection",
                    models.BooleanField(
                        blank=True,
                        null=True,
                        verbose_name="contains previous rejection or residue waste",
                    ),
                ),
                ("printed_document", models.JSONField(blank=True, null=True)),
                ("form_document", models.JSONField(blank=True, null=True)),
                ("correction_info", models.JSONField(blank=True, null=True)),
                ("ppc_status", models.JSONField(blank=True, null=True, verbose_name="PPC info")),
                ("locked", models.BooleanField(blank=True, null=True)),
                (
                    "lock_reason",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("ACS", "AsyncSign"),
                            ("ECB", "EpaChangeBiller"),
                            ("EPC", "EpaCorrection"),
                        ],
                        max_length=25,
                        null=True,
                    ),
                ),
                ("transfer_requested", models.BooleanField(blank=True, null=True)),
                ("transfer_status", models.CharField(blank=True, max_length=200, null=True)),
                (
                    "original_sub_type",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("FullElectronic", "Full Electronic"),
                            ("DataImage5Copy", "Data + Image"),
                            ("Hybrid", "Hybrid"),
                            ("Image", "Image"),
                        ],
                        max_length=25,
                        null=True,
                        verbose_name="original submission type",
                    ),
                ),
                ("transfer_count", models.IntegerField(blank=True, null=True)),
                (
                    "next_transfer_time",
                    models.DateTimeField(blank=True, null=True, verbose_name="next transfer time"),
                ),
                (
                    "additional_info",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="trak.additionalinfo",
                    ),
                ),
                (
                    "generator",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="generator",
                        to="trak.handler",
                    ),
                ),
                (
                    "tsdf",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="designated_facility",
                        to="trak.handler",
                        verbose_name="designated facility",
                    ),
                ),
            ],
            options={
                "ordering": ["update_date", "mtn"],
            },
        ),
        migrations.CreateModel(
            name="ManifestPhone",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("number", apps.trak.models.contact_models.ManifestPhoneNumber(max_length=12)),
                ("extension", models.CharField(blank=True, max_length=6, null=True)),
            ],
            options={
                "ordering": ["number"],
            },
        ),
        migrations.CreateModel(
            name="PaperSignature",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("printed_name", models.CharField(max_length=255)),
                ("sign_date", models.DateTimeField()),
            ],
            options={
                "ordering": ["pk"],
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="PortOfEntry",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
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
                        max_length=2,
                        null=True,
                    ),
                ),
                ("city_port", models.CharField(blank=True, max_length=100, null=True)),
            ],
            options={
                "verbose_name": "Port of Entry",
                "verbose_name_plural": "Ports of Entry",
            },
        ),
        migrations.CreateModel(
            name="WasteCode",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("description", models.TextField(blank=True, null=True)),
                ("code", models.CharField(max_length=6, unique=True)),
                (
                    "code_type",
                    models.CharField(choices=[("ST", "State"), ("FD", "Federal")], max_length=2),
                ),
            ],
            options={
                "ordering": ["code"],
            },
        ),
        migrations.CreateModel(
            name="WasteLine",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("dot_hazardous", models.BooleanField(verbose_name="DOT hazardous")),
                (
                    "dot_info",
                    models.JSONField(blank=True, null=True, verbose_name="DOT information"),
                ),
                ("quantity", models.JSONField(blank=True, null=True)),
                ("hazardous_waste", models.JSONField(blank=True, null=True)),
                ("line_number", models.PositiveIntegerField(verbose_name="waste line number")),
                ("br", models.BooleanField(verbose_name="BR info provided")),
                (
                    "br_info",
                    models.JSONField(blank=True, null=True, verbose_name="BR information"),
                ),
                (
                    "management_method",
                    models.JSONField(blank=True, null=True, verbose_name="management method code"),
                ),
                ("pcb", models.BooleanField(verbose_name="contains PCBs")),
                (
                    "pcb_infos",
                    models.JSONField(blank=True, null=True, verbose_name="PCB information"),
                ),
                (
                    "discrepancy_info",
                    models.JSONField(
                        blank=True, null=True, verbose_name="discrepancy-residue information"
                    ),
                ),
                ("epa_waste", models.BooleanField(verbose_name="EPA waste")),
                ("additional_info", models.JSONField(blank=True, null=True)),
                (
                    "manifest",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="wastes",
                        to="trak.manifest",
                    ),
                ),
            ],
            options={
                "ordering": ["manifest__mtn", "line_number"],
            },
        ),
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
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="trak.manifestphone",
                    ),
                ),
            ],
            options={
                "ordering": ["first_name"],
            },
        ),
        migrations.CreateModel(
            name="ImportInfo",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("import_generator", models.JSONField(blank=True, null=True)),
                (
                    "port_of_entry",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.PROTECT,
                        to="trak.portofentry",
                    ),
                ),
            ],
            options={
                "verbose_name": "Import Info",
                "verbose_name_plural": "Import Info",
            },
        ),
        migrations.AddField(
            model_name="handler",
            name="paper_signature",
            field=models.OneToOneField(
                blank=True,
                help_text="The signature associated with hazardous waste custody exchange",
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="trak.papersignature",
            ),
        ),
        migrations.AddField(
            model_name="handler",
            name="rcra_site",
            field=models.ForeignKey(
                help_text="Hazardous waste rcra_site associated with the manifest",
                on_delete=django.db.models.deletion.CASCADE,
                to="sites.rcrasite",
            ),
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
                ("on_behalf", models.BooleanField(blank=True, default=False, null=True)),
                (
                    "manifest_handler",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="e_signatures",
                        to="trak.handler",
                    ),
                ),
                (
                    "signer",
                    models.OneToOneField(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="trak.signer",
                    ),
                ),
            ],
            options={
                "verbose_name": "e-Signature",
                "ordering": ["sign_date"],
            },
        ),
        migrations.CreateModel(
            name="Transporter",
            fields=[
                (
                    "handler_ptr",
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to="trak.handler",
                    ),
                ),
                ("order", models.PositiveIntegerField()),
                (
                    "manifest",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="transporters",
                        to="trak.manifest",
                    ),
                ),
            ],
            options={
                "ordering": ["manifest__mtn"],
            },
            bases=("trak.handler",),
        ),
    ]
