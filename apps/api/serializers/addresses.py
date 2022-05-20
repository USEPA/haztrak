from rest_framework import serializers

from lib.rcrainfo.lookups import get_country_name, get_state_name


# TODO remove duplication of MailAddressField and SiteAddressField
class MailAddressField(serializers.Field):
    def to_representation(self, value):
        state_name = get_state_name(value.mail_state)
        country_name = get_country_name(value.mail_country)
        mail_address = {"streetNumber": value.mail_street_number,
                        "address1": value.mail_address1,
                        "address2": value.mail_address2,
                        "city": value.mail_city,
                        "state": {
                            "code": value.mail_state,
                            "name": state_name,
                        },
                        "country": {
                            "code": value.mail_country,
                            "name": country_name,
                        },
                        "zip": value.mail_zip
                        }
        # remove nulls when serializing for fun
        for key, value in dict(mail_address).items():
            if value is None:
                try:
                    del mail_address[key]
                except KeyError:
                    pass
        return mail_address

    def to_internal_value(self, data):
        address = {}
        try:
            address = {'mail_address1': data['address1'],
                       'mail_state': data['state']['code'],
                       'mail_country': data['country']['code']}
        except KeyError:
            pass
        return address


class SiteAddressField(serializers.Field):
    def to_representation(self, value):
        state_name = get_state_name(value.site_state)
        country_name = get_country_name(value.site_country)
        site_address = {"streetNumber": value.site_street_number,
                        "address1": value.site_address1,
                        "address2": value.site_address2,
                        "city": value.site_city,
                        "state": {
                            "code": value.site_state,
                            "name": state_name,
                        },
                        "country": {
                            "code": value.site_country,
                            "name": country_name,
                        },
                        "zip": value.site_zip
                        }
        # remove nulls when serializing for fun
        for key, value in dict(site_address).items():
            if value is None:
                try:
                    del site_address[key]
                except KeyError:
                    pass
        return site_address

    def to_internal_value(self, data):
        address = {}
        try:
            address = {'site_address1': data['address1'],
                       'site_state': data['state']['code'],
                       'site_country': data['country']['code']}
        except KeyError:
            pass
        return address
