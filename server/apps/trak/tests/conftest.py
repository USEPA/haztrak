import json
from datetime import date, datetime

import pytest
from django.contrib.auth.models import User

from apps.trak.models import Address, Handler, Manifest, RcraProfile, Site
from apps.trak.serializers import WasteLineSerializer
from apps.trak.tests.serializers.test_serializers import TEST_WASTE1_JSON


@pytest.fixture
def testuser1(db) -> User:
    """Django user with username: 'testuser1', password: 'password1'"""
    return User.objects.create_user(username='testuser1', email='testuser1@haztrak.net',
                                    password='password1')


@pytest.fixture
def other_user(db) -> User:
    """Django user with username: 'other_user', password: 'password1'"""
    return User.objects.create_user(username='other_user',
                                    email='other@haztrak.net',
                                    password='password1')


@pytest.fixture
def address_123_main(db) -> Address:
    return Address.objects.create(address1='Main st.', street_number='123',
                                  country='VA', city='Arlington')


@pytest.fixture
def generator001(db, address_123_main) -> Handler:
    return Handler.objects.create(epa_id='handler001', name='my_handler',
                                  site_type='Generator', site_address=address_123_main,
                                  mail_address=address_123_main, contact="{}")


@pytest.fixture
def site_generator001(db, generator001) -> Site:
    return Site.objects.create(epa_site=generator001, name=generator001.name)


@pytest.fixture
def site_tsd001(db, tsd001) -> Site:
    return Site.objects.create(epa_site=tsd001, name=tsd001.name)


@pytest.fixture
def tsd001(db, address_123_main) -> Handler:
    return Handler.objects.create(epa_id='tsd001', name='my_tsd',
                                  site_type='Tsd', site_address=address_123_main,
                                  mail_address=address_123_main, contact="{}")


@pytest.fixture
def waste_serializer(db) -> WasteLineSerializer:
    with open(TEST_WASTE1_JSON, 'r') as f:
        data = json.load(f)
    return WasteLineSerializer(data=data)


@pytest.fixture
def manifest_elc(db, address_123_main, generator001, tsd001) -> Manifest:
    return Manifest.objects.create(mtn='0123456789ELC',
                                   created_date=datetime.now(),
                                   potential_ship_date=date.today(),
                                   generator=generator001, tsd=tsd001)


@pytest.fixture
def test_user_profile(db, site_generator001, testuser1) -> RcraProfile:
    profile = RcraProfile.objects.create(rcra_api_id='rcraApiId',
                                         rcra_api_key='rcraApikey',
                                         rcra_username='dpgraham4401',
                                         user=testuser1)
    profile.epa_sites.add(site_generator001)
    profile.save()
    return profile


@pytest.fixture
def other_user_profile(db, site_tsd001, other_user) -> RcraProfile:
    profile = RcraProfile.objects.create(rcra_api_id='rcraApiId',
                                         rcra_api_key='rcraApikey',
                                         rcra_user_name='other_user',
                                         user=other_user)
    profile.epa_sites.add(site_tsd001)
    profile.save()
    return profile
