import pytest

from apps.trak.models import Signer
from apps.trak.serializers import ESignatureSerializer


class TestESignatureSerializer:
    """
    Test suite for e-Manifest electronic signatures serialization to/from JSON
    """

    @pytest.fixture(autouse=True)
    def _setup(self, haztrak_json):
        self.json = haztrak_json.E_SIGNATURE.value

    def test_e_signature_serializes(self):
        e_signature_serializer = ESignatureSerializer(data=self.json)
        assert e_signature_serializer.is_valid() is True

    def test_serializer_saves_new_signer(
        self,
        manifest_handler_factory,
        e_signature_serializer,
    ):
        e_signature_serializer.save(manifest_handler=manifest_handler_factory())
        assert Signer.objects.filter(first_name=self.json["signer"]["firstName"]).exists()

    def test_e_signature_serializer_saves_new_document(self):
        # ToDo: implement EPA's humanReadableDocument that's part
        #  of the electronicSignaturesInfo body
        pass
