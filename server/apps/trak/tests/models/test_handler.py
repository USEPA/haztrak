from apps.trak.models import Handler


class TestHandlerModel:
    """Test related to the Handler model and it's API"""

    def test_handler_created(self, db, handler001: Handler) -> None:
        assert type(handler001) is Handler

    def test_handler_connects_to_site_address(self, db, handler001,
                                              address_123_main) -> None:
        assert handler001.site_address.address1 == address_123_main.address1

    def test_handler_db_read_write(self, db, handler001) -> None:
        handler001.save()
        from_db_handler = Handler.objects.get(epa_id=handler001.epa_id)
        assert type(from_db_handler) is Handler
