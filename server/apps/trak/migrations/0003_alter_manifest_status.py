# Generated by Django 4.1.3 on 2022-12-16 17:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trak', '0002_alter_handler_site_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='manifest',
            name='status',
            field=models.CharField(choices=[('NotAssigned', 'Not Assigned'), ('Pending', 'Pending'), ('Scheduled', 'Scheduled'), ('InTransit', 'In Transit'), ('ReadyForSignature', 'Ready for Signature'), ('Signed', 'Signed'), ('Corrected', 'Corrected'), ('UnderCorrection', 'Under Correction'), ('MtnValidationFailed', 'MTN Validation Failed')], default='NotAssigned', max_length=25),
        ),
    ]
