# Generated by Django 4.0.4 on 2022-05-05 14:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trak', '0011_alter_handler_site_address'),
    ]

    operations = [
        migrations.AlterField(
            model_name='handler',
            name='mailing_address',
            field=models.JSONField(),
        ),
        migrations.AlterField(
            model_name='handler',
            name='site_address',
            field=models.JSONField(),
        ),
    ]
