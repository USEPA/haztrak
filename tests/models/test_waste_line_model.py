from django.db.models import ObjectDoesNotExist
from django.test import TestCase

from apps.trak.models import Manifest, WasteLine

MIN_WASTELINE = {
    'dot_hazardous': True,
    'br': False,
    'pcb': False,
    'epa_waste': True,
    'line_number': 1,
}


class WasteLineModelTest(TestCase):
    fixtures = ['site_handler_manifest.json']

    def test_create_minimal_wasteline(self):
        try:
            manifest = Manifest.objects.get(id=1)
            my_waste = WasteLine.objects.create(manifest=manifest, **MIN_WASTELINE)
            self.assertIsInstance(my_waste, WasteLine)
        except ObjectDoesNotExist as e:
            self.fail(e)
