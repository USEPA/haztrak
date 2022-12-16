# Generated by Django 4.1.3 on 2022-12-16 20:28

from django.db import migrations, models

import apps.trak.models.manifest


class Migration(migrations.Migration):
    dependencies = [
        ('trak', '0003_alter_manifest_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='manifest',
            name='mtn',
            field=models.CharField(default=apps.trak.models.manifest.draft_mtn, max_length=15,
                                   verbose_name='manifest Tracking Number'),
        ),
    ]
