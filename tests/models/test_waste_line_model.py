from django.test import TestCase

from apps.trak.models import WasteLine

MIN_WASTELINE = {
    'dot_hazardous': True,
    'br': False,
    'pcb': False,
    'epa_waste': True,
    'line_number': 1,
}


class WasteLineModelTest(TestCase):
    fixtures = ['test_waste_line.json']

    def test_fixture(self):
        waste_line = WasteLine.objects.get(id=1)
        self.assertIsNotNone(waste_line)

    def test_is_instance_of_WasteLine(self):
        waste_line = WasteLine.objects.get(id=1)
        self.assertIsInstance(waste_line, WasteLine)

    def test_create_minimal_wasteline(self):
        my_waste = WasteLine.objects.create(**MIN_WASTELINE)
        self.assertIsInstance(my_waste, WasteLine)
