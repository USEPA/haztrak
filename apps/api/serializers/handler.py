from rest_framework import serializers

from apps.trak.models import Handler

from . import MailAddressField, SiteAddressField


class HandlerSerializer(serializers.ModelSerializer):
    # siteType TODO
    epaSiteId = serializers.CharField(
        source='epa_id')
    modified = serializers.BooleanField(
        allow_null=True,
        default=False)
    # name
    mailingAddress = MailAddressField(
        source='*')
    siteAddress = SiteAddressField(
        source='*')
    # contact
    emergencyPhone = serializers.JSONField(
        source='emergency_phone',
        allow_null=True,
        default=None)
    # paperSignatureInfo TODO
    electronicSignatureInfo = serializers.JSONField(
        source='electronic_signatures_info',
        allow_null=True,
        default=None)
    # order TODO
    registered = serializers.BooleanField(
        allow_null=True,
        default=False)
    limitedEsign = serializers.BooleanField(
        source='limited_esign',
        allow_null=True,
        default=False)
    canEsign = serializers.BooleanField(
        source='can_esign',
        allow_null=True,
        default=False)
    hasRegisteredEmanifestUser = serializers.BooleanField(
        source='registered_emanifest_user',
        allow_null=True,
        default=False)
    gisPrimary = serializers.BooleanField(
        source='gis_primary',
        allow_null=True,
        default=False)

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
            # 'paperSignatureInfo',
            'electronicSignatureInfo',
            # 'order',
            'registered',
            'limitedEsign',
            'canEsign',
            'hasRegisteredEmanifestUser',
            'gisPrimary',
        ]
