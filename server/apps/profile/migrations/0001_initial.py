# Generated by Django 4.2.10 on 2024-02-17 21:09

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='RcrainfoProfile',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('rcra_api_key', models.CharField(blank=True, max_length=128, null=True)),
                ('rcra_api_id', models.CharField(blank=True, max_length=128, null=True)),
                ('rcra_username', models.CharField(blank=True, max_length=128, null=True)),
                ('phone_number', models.CharField(blank=True, max_length=15, null=True)),
                ('email', models.EmailField(max_length=254)),
            ],
            options={
                'ordering': ['rcra_username'],
            },
        ),
        migrations.CreateModel(
            name='TrakProfile',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('rcrainfo_profile', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='haztrak_profile', to='profile.rcrainfoprofile')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='haztrak_profile', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Haztrak Profile',
                'ordering': ['user__username'],
                'default_related_name': 'haztrak_profile',
            },
        ),
        migrations.CreateModel(
            name='RcrainfoSiteAccess',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('site', models.CharField(max_length=12)),
                ('site_manager', models.BooleanField(default=False)),
                ('annual_report', models.CharField(choices=[('Certifier', 'Certifier'), ('Preparer', 'Preparer'), ('Viewer', 'Viewer')], max_length=12)),
                ('biennial_report', models.CharField(choices=[('Certifier', 'Certifier'), ('Preparer', 'Preparer'), ('Viewer', 'Viewer')], max_length=12)),
                ('e_manifest', models.CharField(choices=[('Certifier', 'Certifier'), ('Preparer', 'Preparer'), ('Viewer', 'Viewer')], max_length=12)),
                ('my_rcra_id', models.CharField(choices=[('Certifier', 'Certifier'), ('Preparer', 'Preparer'), ('Viewer', 'Viewer')], max_length=12)),
                ('wiets', models.CharField(choices=[('Certifier', 'Certifier'), ('Preparer', 'Preparer'), ('Viewer', 'Viewer')], max_length=12)),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='permissions', to='profile.rcrainfoprofile')),
            ],
            options={
                'verbose_name': 'RCRAInfo Permission',
                'verbose_name_plural': 'RCRAInfo Permissions',
                'ordering': ['site'],
            },
        ),
    ]
