import json
import os

import requests
from celery import shared_task
from django.contrib.auth.models import User
from emanifest import client as em
from requests import RequestException

from apps.trak.models import Handler, RcraProfile, Site
from apps.trak.serializers import HandlerSerializer


@shared_task(name="sync_user_sites")
def sync_user_sites(username: str) -> None:
    """
    This task pulls the current user's sites they have access to in RCRAInfo and
    saves it to their profile.

    User's RcraProfile needs to have an API ID, Key, and their exact RCRAInfo username
    """
    rcrainfo_env = os.getenv('HT_RCRAINFO_ENV', 'preprod')
    try:
        profile = RcraProfile.objects.get(user__username=username)
        if not profile.rcra_username or not profile.rcra_api_id or not profile.rcra_api_key:
            raise Exception('missing attribute(s) from RcraProfile')
    except RcraProfile.DoesNotExist:
        RcraProfile.objects.create(user=User.objects.get(username=username))
        raise Exception('RcraProfile is non existent... creating. Needs attributes')
    rcra_client = em.new_client(rcrainfo_env)
    rcra_client.Auth(profile.rcra_api_id, profile.rcra_api_key)
    data = request_user_date(profile.rcra_username, rcra_client.token)
    sites_ids = parse_site_ids(data)
    handlers = []
    sites = []
    for site_id in sites_ids:
        try:
            existing_handler = check_handler_exist(site_id)
            handlers.append(existing_handler)
        except Handler.DoesNotExist:
            response = rcra_client.GetSiteDetails(site_id)
            if response.response.ok:
                new_handler = save_handler(response.response.json())
                if new_handler:
                    handlers.append(new_handler)
    for handler in handlers:
        try:
            existing_site = Site.objects.get(epa_site=handler)
            sites.append(existing_site)
        except Site.DoesNotExist:
            sites.append(handler_to_site_with_user(handler, profile))


def parse_site_ids(data):
    number_users = len(data['users'])
    site_ids = []
    if number_users == 1:
        for i in data['users'][0]['sites']:
            site_ids.append(i['siteId'])
    return site_ids


def request_user_date(username: str, token: str):
    """ToDO remove this in exchange for emanifest library after PR"""
    response = requests.post(
        'https://rcrainfopreprod.epa.gov/rcrainfo/rest/api/v1/user/user-search',
        headers={'Content-Type': 'text/plain',
                 'Accept': 'application/json',
                 'Authorization': 'Bearer ' + token},
        data=json.dumps({'userId': username}), timeout=(5.0, 30.0))
    if response.ok:
        return response.json()
    else:
        raise RequestException(response.json())


def save_handler(handler_data) -> Handler:
    serializer = HandlerSerializer(data=handler_data)
    if serializer.is_valid():
        new_handler: Handler = serializer.save()
        return new_handler


def handler_to_site_with_user(handler_object: Handler, profile: RcraProfile) -> None:
    new_site = Site.objects.create(epa_site=handler_object, name=handler_object.name)
    profile.epa_sites.add(new_site)


def check_handler_exist(site_id: str) -> Handler:
    handler = Handler.objects.get(epa_id=site_id)
    if handler:
        return handler
