# Generated by Django 4.0.4 on 2022-04-28 12:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('trak', '0010_rename_receiveddate_manifest_received_date_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='manifest',
            old_name='designatedFacility',
            new_name='tsd',
        ),
    ]
