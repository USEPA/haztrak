# Generated by Django 4.0.4 on 2022-04-29 18:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('street_number', models.IntegerField(blank=True, null=True)),
                ('address1', models.CharField(max_length=200)),
                ('address2', models.CharField(blank=True, default=None, max_length=200, null=True)),
                ('city', models.CharField(max_length=200)),
                ('zip_code', models.CharField(max_length=32)),
                ('state_name', models.CharField(choices=[('AK', 'Alaska'), ('AL', 'Alabama'), ('AP', 'Armed Forces Pacific'), ('AR', 'Arkansas'), ('AZ', 'Arizona'), ('CA', 'California'), ('CO', 'Colorado'), ('CT', 'Connecticut'), ('DC', 'Washington DC'), ('DE', 'Delaware'), ('FL', 'Florida'), ('GA', 'Georgia'), ('GU', 'Guam'), ('HI', 'Hawaii'), ('IA', 'Iowa'), ('ID', 'Idaho'), ('IL', 'Illinois'), ('IN', 'Indiana'), ('KS', 'Kansas'), ('KY', 'Kentucky'), ('LA', 'Louisiana'), ('MA', 'Massachusetts'), ('MD', 'Maryland'), ('ME', 'Maine'), ('MI', 'Michigan'), ('MN', 'Minnesota'), ('MO', 'Missouri'), ('MS', 'Mississippi'), ('MT', 'Montana'), ('NC', 'North Carolina'), ('ND', 'North Dakota'), ('NE', 'Nebraska'), ('NH', 'New Hampshire'), ('NJ', 'New Jersey'), ('NM', 'New Mexico'), ('NV', 'Nevada'), ('NY', 'New York'), ('OH', 'Ohio'), ('OK', 'Oklahoma'), ('OR', 'Oregon'), ('PA', 'Pennsylvania'), ('PR', 'Puerto Rico'), ('RI', 'Rhode Island'), ('SC', 'South Carolina'), ('SD', 'South Dakota'), ('TN', 'Tennessee'), ('TX', 'Texas'), ('UT', 'Utah'), ('VA', 'Virginia'), ('VI', 'Virgin Islands'), ('VT', 'Vermont'), ('WA', 'Washington'), ('WI', 'Wisconsin'), ('WV', 'West Virginia'), ('WY', 'Wyoming'), ('XA', 'REGION 01 PURVIEW'), ('XB', 'REGION 02 PURVIEW'), ('XC', 'REGION 03 PURVIEW'), ('XD', 'REGION 04 PURVIEW'), ('XE', 'REGION 05 PURVIEW'), ('XF', 'REGION 06 PURVIEW'), ('XG', 'REGION 07 PURVIEW'), ('XH', 'REGION 08 PURVIEW'), ('XI', 'REGION 09 PURVIEW'), ('XJ', 'REGION 10 PURVIEW')], max_length=32)),
            ],
        ),
        migrations.CreateModel(
            name='ElectronicSignature',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('signer_first_name', models.CharField(max_length=200)),
                ('signer_last_name', models.CharField(max_length=200)),
                ('signer_user_id', models.CharField(max_length=200)),
                ('signature_date', models.DateTimeField(verbose_name='signature_date')),
            ],
        ),
        migrations.CreateModel(
            name='Handler',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('epa_id', models.CharField(max_length=25, verbose_name='EPA Id number')),
                ('name', models.CharField(max_length=200, verbose_name='Name')),
                ('modified', models.BooleanField(blank=True, null=True, verbose_name='Modified')),
                ('registered', models.BooleanField(blank=True, null=True, verbose_name='Registered')),
                ('mailing_address', models.JSONField(verbose_name='Mailing address')),
                ('site_address', models.JSONField(verbose_name='Site address')),
                ('contact', models.JSONField(verbose_name='Contact information')),
                ('emergency_phone', models.JSONField(blank=True, null=True, verbose_name='Emergency phone')),
                ('electronic_signatures_info', models.JSONField(blank=True, null=True, verbose_name='Electronic signature info')),
                ('gis_primary', models.BooleanField(blank=True, default=False, null=True, verbose_name='GIS primary')),
                ('can_esign', models.BooleanField(blank=True, null=True, verbose_name='Can electronically sign')),
                ('limited_esign', models.BooleanField(blank=True, null=True, verbose_name='Limited electronic signing ability')),
                ('registered_emanifest_user', models.BooleanField(blank=True, default=False, null=True, verbose_name='Has Registered e-Manifest user')),
            ],
        ),
        migrations.CreateModel(
            name='Site',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='Site Alias')),
                ('epa_site', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='trak.handler', verbose_name='EPA Handler')),
            ],
        ),
        migrations.CreateModel(
            name='Manifest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now=True, null=True, verbose_name='Created Date')),
                ('update_date', models.DateTimeField(auto_now=True)),
                ('mtn', models.CharField(max_length=15, verbose_name='Manifest Tracking Number')),
                ('status', models.CharField(choices=[('notAssigned', 'Not Assigned'), ('Pending', 'Pending'), ('Scheduled', 'Scheduled'), ('InTransit', 'In Transit'), ('ReadyForSignature', 'Ready for Signature'), ('Signed', 'Signed'), ('Corrected', 'Corrected'), ('UnderCorrection', 'Under Correction'), ('MtnValidationFailed', 'MTN Validation Failed')], default='notAssigned', max_length=25, verbose_name='Status')),
                ('submission_type', models.CharField(choices=[('FullElectronic', 'Full Electronic'), ('DataImage5Copy', 'Data + Image'), ('Hybrid', 'Hybrid'), ('Image', 'Image')], default='FullElectronic', max_length=25, verbose_name='Submission Type')),
                ('signature_status', models.BooleanField(blank=True, null=True, verbose_name='Signature status')),
                ('origin_type', models.CharField(choices=[('Web', 'Web'), ('Service', 'Service'), ('Mail', 'Mail')], default='Service', max_length=25, verbose_name='Origin Type')),
                ('shipped_date', models.DateTimeField(blank=True, null=True, verbose_name='Shipped date')),
                ('potential_ship_date', models.DateTimeField(blank=True, null=True, verbose_name='Potential ship date')),
                ('received_date', models.DateTimeField(blank=True, null=True, verbose_name='Received date')),
                ('certified_date', models.DateTimeField(blank=True, null=True, verbose_name='Certified date')),
                ('certified_by', models.JSONField(blank=True, null=True, verbose_name='Certified By')),
                ('transporters', models.JSONField(verbose_name='Transporters')),
                ('broker', models.JSONField(blank=True, null=True)),
                ('wastes', models.JSONField()),
                ('rejection', models.BooleanField(blank=True, default=False, null=True, verbose_name='Rejection')),
                ('rejection_info', models.JSONField(blank=True, null=True, verbose_name='Rejection Information')),
                ('discrepancy', models.BooleanField(default=False, verbose_name='Discrepancy')),
                ('residue', models.BooleanField(blank=True, null=True, verbose_name='Residue')),
                ('residue_new_mtn', models.JSONField(blank=True, null=True, verbose_name='Residue new MTN')),
                ('import_flag', models.BooleanField(blank=True, null=True, verbose_name='Import')),
                ('import_info', models.JSONField(blank=True, null=True, verbose_name='Import Information')),
                ('contains_residue_or_rejection', models.BooleanField(blank=True, null=True, verbose_name='Contains previous rejection or residue')),
                ('printed_document', models.JSONField(blank=True, null=True, verbose_name='Printed document')),
                ('form_document', models.JSONField(blank=True, null=True, verbose_name='Form document')),
                ('additional_info', models.JSONField(blank=True, null=True, verbose_name='Additional info')),
                ('correction_info', models.JSONField(blank=True, null=True, verbose_name='Correction info')),
                ('ppc_status', models.JSONField(blank=True, null=True, verbose_name='PPC info')),
                ('locked', models.BooleanField(blank=True, null=True)),
                ('locked_reason', models.CharField(blank=True, choices=[('AsyncSign', 'Asynchronous signature'), ('EpaChangeBiller', 'EPA change biller'), ('EpaCorrection', 'EPA corrections')], max_length=25, null=True, verbose_name='Lock reason')),
                ('transfer_requested', models.BooleanField(blank=True, null=True, verbose_name='Transfer requested')),
                ('transfer_status', models.CharField(blank=True, max_length=200, null=True, verbose_name='Transfer Status')),
                ('original_sub_type', models.CharField(choices=[('FullElectronic', 'Full Electronic'), ('DataImage5Copy', 'Data + Image'), ('Hybrid', 'Hybrid'), ('Image', 'Image')], max_length=25, null=True, verbose_name='Original Submission Type')),
                ('transfer_count', models.IntegerField(blank=True, null=True, verbose_name='Transfer Count')),
                ('next_transfer_time', models.DateTimeField(blank=True, null=True, verbose_name='Next Transfer Time')),
                ('generator', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='generator', to='trak.handler', verbose_name='Generator')),
                ('tsd', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='designated_facility', to='trak.handler', verbose_name='Designated facility')),
            ],
        ),
    ]
