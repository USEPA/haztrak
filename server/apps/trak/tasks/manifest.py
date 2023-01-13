from celery import shared_task


@shared_task(bind=True, name='sync manifests')
def sync_site_manifests(self):
    return None
