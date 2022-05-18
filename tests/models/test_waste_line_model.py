from django.test import TestCase

from apps.trak.models import WasteLine


class WasteLineModelTest(TestCase):
    fixtures = ['test_waste_line.json']

    def test_fixture(self):
        waste_line = WasteLine.objects.get(id=1)
        self.assertIsNotNone(waste_line)
