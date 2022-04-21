# Generated by Django 4.0.4 on 2022-04-18 14:21

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trak', '0007_remove_manifestsimple_origin_type_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='manifestsimple',
            name='submissionType',
            field=models.CharField(choices=[('FullElectronic', 'Full Electronic'), ('DataImage5Copy', 'Data + Image'), ('Hybrid', 'Hybrid'), ('Image', 'Image')], default='FullElectronic', max_length=25),
        ),
        migrations.AlterField(
            model_name='manifestsimple',
            name='createdDate',
            field=models.DateTimeField(default=datetime.datetime(2022, 4, 18, 10, 21, 18, 554217), null=True),
        ),
    ]
