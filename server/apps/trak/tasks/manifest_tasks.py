from celery import shared_task

from apps.trak.services import ManifestService, SiteService


@shared_task(name='sync manifests', retry_backoff=True)
def sync_site_manifests(username: str, site_id: str):
    site_service = SiteService(user=username)
    foo = site_service.sync_site_manifest(site_id=site_id)
    print(foo)
    return foo.response.json()
    # ToDo: parse the response and pull manifest from RCRAInfo as needed


@shared_task(name="sync manifest")
def sync_manifest(*, mtn: str, user: str):
    manifest_service = ManifestService(user=user)
    manifest_service.retrieve_rcra_manifest(mtn=mtn)
