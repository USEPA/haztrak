from apps.trak.models import Handler


class TestHandlerModel:
    """Test related to the Handler model and it's API"""

    def test_handler_created(self, db, generator001) -> None:
        assert type(generator001) is Handler

    def test_handler_connects_to_site_address(self, db, generator001, address_123_main) -> None:
        assert generator001.site_address.address1 == address_123_main.address1

    def test_handler_db_read_write(self, db, generator001) -> None:
        generator001.save()
        from_db_handler = Handler.objects.get(epa_id=generator001.epa_id)
        assert type(from_db_handler) is Handler
