# Generated by Django 4.0.4 on 2022-05-24 19:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trak', '0002_transporter'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transporter',
            name='order',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
