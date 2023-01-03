import json
import os
from datetime import date, datetime

import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from apps.trak.models import Address, Handler, Manifest, RcraProfile, Site
from apps.trak.serializers import WasteLineSerializer
from apps.trak.serializers.contact import ContactSerializer
from apps.trak.tests.serializers.test_serializers import TEST_WASTE1_JSON

JSON_DIR = os.path.dirname(os.path.abspath(__file__)) + '/serializers/json'
TEST_CONTACT_JSON = f'{JSON_DIR}/contact/good_contact.json'


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
def contact_serializer(db) -> ContactSerializer:
    with open(TEST_CONTACT_JSON, 'r') as f:
        data = json.load(f)
    return ContactSerializer(data=data)


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


@pytest.fixture
def api_client(db, testuser1) -> APIClient:
    client = APIClient()
    client.force_authenticate(user=testuser1)
    return client


class TestApiClient:
    f"""
    This is a base class for Haztrak's other test suites.
    It includes a number of fixtures already...
    1. testuser1 {User} django's user model
    2. test_user_profile {RcraProfile} testuser1's RcraProfile
    3. generator001 {Handler} handler model testuser1 has access to
    4. site_generator001 {Site} Site with generator001 as it's handler
    5. api_client {APIClient} pre authenticated (testuser1) APIClient

    """

    @pytest.fixture(autouse=True)
    def _profile(self, test_user_profile):
        self.profile = test_user_profile

    @pytest.fixture(autouse=True)
    def _generator(self, generator001):
        self.generator = generator001

    @pytest.fixture(autouse=True)
    def _site(self, site_generator001):
        self.site = site_generator001

    @pytest.fixture(autouse=True)
    def _test_user(self, testuser1):
        self.user = testuser1

    @pytest.fixture(autouse=True)
    def _api_client(self, api_client):
        self.client = api_client
