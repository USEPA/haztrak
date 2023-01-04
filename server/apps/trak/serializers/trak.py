from rest_framework import serializers

from apps.trak.models import (Address, Contact, EpaPhone, Handler, Manifest,
                              Transporter)


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

    def create_handler(self, **handler_data) -> Handler:
        handler_contact = handler_data.pop('contact')
        if 'phone' in handler_contact:
            phone_data = handler_contact.pop('phone')
            new_phone = EpaPhone.objects.create(**phone_data)
            new_contact = Contact.objects.create(**handler_contact, phone=new_phone)
        else:
            new_contact = Contact.objects.create(**handler_contact)
        handler_dict = self.pop_addresses(**handler_data)
        new_handler = Handler.objects.create(site_address=handler_dict['site_address'],
                                             mail_address=handler_dict['mail_address'],
                                             **handler_dict['handler_data'],
                                             contact=new_contact)
        return new_handler

    def create_transporter(self, manifest: Manifest,
                           **transporter_data: dict) -> Transporter:
        """ToDo(!!!) remove redundancies like this"""
        handler_contact = transporter_data.pop('contact')
        if 'phone' in handler_contact:
            phone_data = handler_contact.pop('phone')
            new_phone = EpaPhone.objects.create(**phone_data)
            new_contact = Contact.objects.create(**handler_contact, phone=new_phone)
        else:
            new_contact = Contact.objects.create(**handler_contact)
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
