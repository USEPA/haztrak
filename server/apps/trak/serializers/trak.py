from rest_framework import serializers

from apps.trak.models import Address, Contact, Manifest, Transporter


class TrakBaseSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        """ Remove null fields when serializing """
        data = super().to_representation(instance)
        for field in self.fields:
            try:
                if data[field] is None:
                    data.pop(field)
            except KeyError:
                pass
        return data

    # ToDo: remove this. Move logic to Transporter model and serializer after Transporter model
    #  Is refactored to include ForeignKey to Handler model.
    def create_transporter(self, manifest: Manifest,
                           **transporter_data: dict) -> Transporter:
        new_contact = Contact.objects.create(**transporter_data.pop('contact'))
        handler_parsed = self.pop_addresses(**transporter_data)
        new_transporter = Transporter.objects.create(manifest=manifest,
                                                     site_address=handler_parsed[
                                                         'site_address'],
                                                     mail_address=handler_parsed[
                                                         'mail_address'],
                                                     **handler_parsed['handler_data'],
                                                     contact=new_contact)
        return new_transporter

    @staticmethod
    def pop_addresses(**handler_data) -> dict:
        site_address_data = handler_data.pop('site_address')
        mail_address_data = handler_data.pop('mail_address')
        site_address = Address.objects.create(**site_address_data)
        mail_address = Address.objects.create(**mail_address_data)
        return {'site_address': site_address,
                'mail_address': mail_address,
                'handler_data': handler_data}
