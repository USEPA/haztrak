# Generated by Django 4.0.4 on 2022-04-18 16:44

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trak', '0020_alter_manifestsimple_additionalinfo_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='manifestsimple',
            name='createdDate',
            field=models.DateTimeField(default=datetime.datetime(2022, 4, 18, 12, 44, 37, 990783), null=True),
        ),
        migrations.AlterField(
            model_name='manifestsimple',
            name='formDocument',
            field=models.JSONField(null=True),
        ),
    ]
