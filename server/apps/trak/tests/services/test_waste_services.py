from apps.trak.services import get_dot_hazard_classes, get_dot_id_numbers, get_dot_shipping_names


class TestWasteServices:
    def test_shipping_names_are_filtered(self, db):
        """Test shipping names returns list filtered by query"""
        query = "acid"
        shipping_names = get_dot_shipping_names(query)
        assert isinstance(shipping_names, list)
        for name in shipping_names:
            assert query.lower() in name.lower()

    def test_hazard_classes_are_filtered(self, db):
        """Test hazard classes returns list filtered by query"""
        query = "1.1A"
        shipping_names = get_dot_hazard_classes(query)
        assert isinstance(shipping_names, list)
        for name in shipping_names:
            assert query.lower() in name.lower()

    def test_dot_id_numbers_are_filtered(self, db):
        """Test ID number returns list filtered by query"""
        query = "ID8000"
        shipping_names = get_dot_id_numbers(query)
        assert isinstance(shipping_names, list)
        for name in shipping_names:
            assert query.lower() in name.lower()
