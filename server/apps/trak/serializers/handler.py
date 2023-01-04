from rest_framework import serializers

from apps.trak.models import Contact, EpaPhone, Handler
from apps.trak.serializers import AddressSerializer

from .contact import ContactSerializer
from .trak import TrakSerializer


class HandlerSerializer(TrakSerializer):
    epaSiteId = serializers.CharField(
        source='epa_id',
    )
    # siteType = serializers.CharField(
    #     source='site_type',
    # )
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
    contact = ContactSerializer()
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
        handler_contact = validated_data.pop('contact')
        print(handler_contact)
        if 'phone' in handler_contact:
            phone_data = handler_contact.pop('phone')
            new_phone = EpaPhone.objects.create(**phone_data)
            new_contact = Contact.objects.create(**handler_contact, phone=new_phone)
        else:
            new_contact = Contact.objects.create(**handler_contact)
        handler_dict = self.pop_addresses(**validated_data)
        new_handler = Handler.objects.create(site_address=handler_dict['site_address'],
                                             mail_address=handler_dict['mail_address'],
                                             **handler_dict['handler_data'],
                                             contact=new_contact)
        return new_handler

    class Meta:
        model = Handler
        fields = [
            'epaSiteId',
            # 'siteType',
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
