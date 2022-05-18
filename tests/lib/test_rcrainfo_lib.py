import unittest

from lib.rcrainfo.lookups import (COUNTRIES, STATES, get_country_name,
                                  get_state_name)


class RcrainfoTest(unittest.TestCase):

    def test_get_state_name_by_choice(self):
        for i in STATES:
            state_name = get_state_name(i[0])
            with self.subTest(f'Testing {i[0]}'):
                self.assertEqual(state_name, i[1])

    def test_get_country_name_by_choice(self):
        for i in COUNTRIES:
            country_name = get_country_name(i[0])
            with self.subTest(f'Testing {i[0]}'):
                self.assertEqual(country_name, i[1])
