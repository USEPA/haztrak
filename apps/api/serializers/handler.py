from rest_framework import serializers

from apps.trak.models import Address, Handler

from . import AddressSerializer


class HandlerSerializer(serializers.ModelSerializer):
    epaSiteId = serializers.CharField(
        source='epa_id',
    )
    modified = serializers.BooleanField(
        allow_null=True,
        default=False,
    )
    # name
    mailingAddress = AddressSerializer(
        source='mail_address',
    )
    siteAddress = AddressSerializer(
        source='site_address',
    )
    # contact
    emergencyPhone = serializers.JSONField(
        source='emergency_phone',
        allow_null=True,
        default=None,
    )
    # paperSignatureInfo
    electronicSignatureInfo = serializers.JSONField(
        source='electronic_signatures_info',
        allow_null=True,
        default=None,
    )
    registered = serializers.BooleanField(
        allow_null=True,
        default=False,
    )
    limitedEsign = serializers.BooleanField(
        source='limited_esign',
        allow_null=True,
        default=False,
    )
    canEsign = serializers.BooleanField(
        source='can_esign',
        allow_null=True,
        default=False,
    )
    hasRegisteredEmanifestUser = serializers.BooleanField(
        source='registered_emanifest_user',
        allow_null=True,
        default=False,
    )
    gisPrimary = serializers.BooleanField(
        source='gis_primary',
        allow_null=True,
        default=False,
    )

    def create(self, validated_data):
        site_address_data = validated_data.pop('site_address')
        mail_address_data = validated_data.pop('mail_address')
        site_address = Address.objects.create(**site_address_data)
        mail_address = Address.objects.create(**mail_address_data)
        new_handler = Handler.objects.create(site_address=site_address,
                                             mail_address=mail_address,
                                             **validated_data)
        return new_handler

    def to_representation(self, instance):
        data = super().to_representation(instance)
        for field in self.fields:
            try:
                if data[field] is None:
                    data.pop(field)
            except KeyError:
                pass
        return data

    class Meta:
        model = Handler
        fields = [
            'epaSiteId',
            'modified',
            'name',
            'siteAddress',
            'mailingAddress',
            'contact',
            'emergencyPhone',
            'electronicSignatureInfo',
            'registered',
            'limitedEsign',
            'canEsign',
            'hasRegisteredEmanifestUser',
            'gisPrimary',
        ]
