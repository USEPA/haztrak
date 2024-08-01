# Generated by Django 5.0.7 on 2024-08-01 14:06

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('org', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='orggroupobjectpermission',
            name='content_object',
            field=models.ForeignKey(db_column='org_object_id', on_delete=django.db.models.deletion.CASCADE, to='org.org'),
        ),
        migrations.AlterField(
            model_name='orguserobjectpermission',
            name='content_object',
            field=models.ForeignKey(db_column='org_object_id', on_delete=django.db.models.deletion.CASCADE, to='org.org'),
        ),
        migrations.AlterField(
            model_name='sitegroupobjectpermission',
            name='content_object',
            field=models.ForeignKey(db_column='site_object_id', on_delete=django.db.models.deletion.CASCADE, to='org.site'),
        ),
        migrations.AlterField(
            model_name='siteuserobjectpermission',
            name='content_object',
            field=models.ForeignKey(db_column='site_object_id', on_delete=django.db.models.deletion.CASCADE, to='org.site'),
        ),
    ]
