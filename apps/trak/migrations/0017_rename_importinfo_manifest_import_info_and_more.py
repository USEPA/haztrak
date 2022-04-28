# Generated by Django 4.0.4 on 2022-04-28 16:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trak', '0016_rename_certifieddate_manifest_certified_date_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='manifest',
            old_name='importInfo',
            new_name='import_info',
        ),
        migrations.RemoveField(
            model_name='manifest',
            name='correctionInfo',
        ),
        migrations.AddField(
            model_name='manifest',
            name='correction_info',
            field=models.JSONField(blank=True, null=True, verbose_name='Correction info'),
        ),
        migrations.AlterField(
            model_name='manifest',
            name='additional_info',
            field=models.JSONField(blank=True, null=True, verbose_name='Additional info'),
        ),
        migrations.AlterField(
            model_name='manifest',
            name='form_document',
            field=models.JSONField(blank=True, null=True, verbose_name='Form document'),
        ),
        migrations.AlterField(
            model_name='manifest',
            name='printed_document',
            field=models.JSONField(blank=True, null=True, verbose_name='Printed document'),
        ),
        migrations.AlterField(
            model_name='manifest',
            name='transferRequested',
            field=models.BooleanField(blank=True, null=True, verbose_name='Transfer requested'),
        ),
    ]
