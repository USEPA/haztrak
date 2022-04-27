# Generated by Django 4.0.4 on 2022-04-29 19:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trak', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='address1',
            field=models.CharField(max_length=200, verbose_name='Address 1'),
        ),
        migrations.AlterField(
            model_name='address',
            name='address2',
            field=models.CharField(blank=True, default=None, max_length=200, null=True, verbose_name='Address 2'),
        ),
        migrations.AlterField(
            model_name='address',
            name='state_name',
            field=models.CharField(choices=[('AK', 'Alaska'), ('AL', 'Alabama'), ('AP', 'Armed Forces Pacific'), ('AR', 'Arkansas'), ('AZ', 'Arizona'), ('CA', 'California'), ('CO', 'Colorado'), ('CT', 'Connecticut'), ('DC', 'Washington DC'), ('DE', 'Delaware'), ('FL', 'Florida'), ('GA', 'Georgia'), ('GU', 'Guam'), ('HI', 'Hawaii'), ('IA', 'Iowa'), ('ID', 'Idaho'), ('IL', 'Illinois'), ('IN', 'Indiana'), ('KS', 'Kansas'), ('KY', 'Kentucky'), ('LA', 'Louisiana'), ('MA', 'Massachusetts'), ('MD', 'Maryland'), ('ME', 'Maine'), ('MI', 'Michigan'), ('MN', 'Minnesota'), ('MO', 'Missouri'), ('MS', 'Mississippi'), ('MT', 'Montana'), ('NC', 'North Carolina'), ('ND', 'North Dakota'), ('NE', 'Nebraska'), ('NH', 'New Hampshire'), ('NJ', 'New Jersey'), ('NM', 'New Mexico'), ('NV', 'Nevada'), ('NY', 'New York'), ('OH', 'Ohio'), ('OK', 'Oklahoma'), ('OR', 'Oregon'), ('PA', 'Pennsylvania'), ('PR', 'Puerto Rico'), ('RI', 'Rhode Island'), ('SC', 'South Carolina'), ('SD', 'South Dakota'), ('TN', 'Tennessee'), ('TX', 'Texas'), ('UT', 'Utah'), ('VA', 'Virginia'), ('VI', 'Virgin Islands'), ('VT', 'Vermont'), ('WA', 'Washington'), ('WI', 'Wisconsin'), ('WV', 'West Virginia'), ('WY', 'Wyoming'), ('XA', 'REGION 01 PURVIEW'), ('XB', 'REGION 02 PURVIEW'), ('XC', 'REGION 03 PURVIEW'), ('XD', 'REGION 04 PURVIEW'), ('XE', 'REGION 05 PURVIEW'), ('XF', 'REGION 06 PURVIEW'), ('XG', 'REGION 07 PURVIEW'), ('XH', 'REGION 08 PURVIEW'), ('XI', 'REGION 09 PURVIEW'), ('XJ', 'REGION 10 PURVIEW')], max_length=32, verbose_name='State'),
        ),
        migrations.AlterField(
            model_name='address',
            name='street_number',
            field=models.IntegerField(blank=True, null=True, verbose_name='Stree number'),
        ),
        migrations.AlterField(
            model_name='address',
            name='zip_code',
            field=models.CharField(max_length=32, verbose_name='Zip'),
        ),
        migrations.AlterField(
            model_name='electronicsignature',
            name='signature_date',
            field=models.DateTimeField(verbose_name='Signature_date'),
        ),
        migrations.AlterField(
            model_name='electronicsignature',
            name='signer_first_name',
            field=models.CharField(max_length=200, verbose_name='First name'),
        ),
        migrations.AlterField(
            model_name='electronicsignature',
            name='signer_last_name',
            field=models.CharField(max_length=200, verbose_name='Last name'),
        ),
        migrations.AlterField(
            model_name='electronicsignature',
            name='signer_user_id',
            field=models.CharField(max_length=200, verbose_name='User ID'),
        ),
        migrations.AlterField(
            model_name='manifest',
            name='contains_residue_or_rejection',
            field=models.BooleanField(blank=True, null=True, verbose_name='Contains previous rejection or residue waste'),
        ),
        migrations.AlterField(
            model_name='manifest',
            name='import_info',
            field=models.JSONField(blank=True, null=True, verbose_name='Import information'),
        ),
        migrations.AlterField(
            model_name='manifest',
            name='received_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
