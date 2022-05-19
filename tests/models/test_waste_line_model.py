from django.test import TestCase

from apps.trak.models import WasteLine

MY_WASTELINE = {
    'dot_hazardous': True,
    'dot_id': '12345',
    'container_count': 2,
    'container_type': 'CM',
    'quantity': 5,
    'quantity_uom': 'K',
    'br_provided': False,
    'pcb': False,
    'epa_waste': True,
    'line_number': 1,
    'management_method': 'test',
    'hazardous_waste': {"blah": "blah"}
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
        my_waste = WasteLine.objects.create(**MY_WASTELINE)
        self.assertIsInstance(my_waste, WasteLine)
