# Generated by Django 4.0.4 on 2022-04-28 13:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trak', '0012_rename_additionalinfo_manifest_additional_info_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='manifest',
            old_name='importFlag',
            new_name='import_flag',
        ),
        migrations.RemoveField(
            model_name='manifest',
            name='residueNewManifestTrackingNumbers',
        ),
        migrations.AddField(
            model_name='manifest',
            name='residue_new_mtn',
            field=models.JSONField(default={}, verbose_name='Residue new MTN'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='manifest',
            name='rejection',
            field=models.BooleanField(blank=True, default=False, null=True, verbose_name='Rejection'),
        ),
    ]
