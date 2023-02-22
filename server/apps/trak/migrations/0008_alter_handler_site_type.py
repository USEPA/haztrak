# Generated by Django 4.1.6 on 2023-02-16 15:46

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("trak", "0007_alter_handler_emergency_phone"),
    ]

    operations = [
        migrations.AlterField(
            model_name="handler",
            name="site_type",
            field=models.CharField(
                choices=[
                    ("Tsdf", "Tsdf"),
                    ("Generator", "Generator"),
                    ("Transporter", "Transporter"),
                    ("Broker", "Broker"),
                ],
                max_length=20,
            ),
        ),
    ]
