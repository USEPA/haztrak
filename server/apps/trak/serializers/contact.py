from rest_framework import serializers

from apps.trak.models import Contact
from apps.trak.serializers.trak import TrakSerializer


class EpaPhoneSerializer(TrakSerializer):
    number = serializers.CharField()
    extension = serializers.CharField(
        required=False,
    )

    class Meta:
        model = Contact
        fields = [
            'number',
            'extension',
        ]


class ContactSerializer(TrakSerializer):
    firstName = serializers.CharField(
        source='first_name',
        required=False,
    )
    middleInitial = serializers.CharField(
        source='middle_initial',
        required=False,
    )
    lastName = serializers.CharField(
        source='last_name',
        required=False,
    )
    phone = EpaPhoneSerializer(
        required=False
    )
    email = serializers.CharField(
        required=False,
    )
    companyName = serializers.CharField(
        source='company_name',
        required=False,
    )

    class Meta:
        model = Contact
        fields = [
            'firstName',
            'middleInitial',
            'lastName',
            'phone',
            'email',
            'companyName',
        ]
