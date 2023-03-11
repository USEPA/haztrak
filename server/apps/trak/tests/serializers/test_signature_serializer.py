from apps.trak.models import Signer
from apps.trak.serializers.signature_ser import ESignatureSerializer


class TestESignatureSerializer:
    """
    Test suite for e-Manifest electronic signatures serialization to/from JSON
    """

    def test_e_signature_serializes(self, e_signature_json):
        e_signature_serializer = ESignatureSerializer(data=e_signature_json)
        assert e_signature_serializer.is_valid() is True

    def test_serializer_saves_new_signer(
        self, manifest_handler_factory, e_signature_serializer, e_signature_json
    ):
        e_signature_serializer.save(manifest_handler=manifest_handler_factory())
        assert Signer.objects.filter(first_name=e_signature_json["signer"]["firstName"]).exists()

    def test_e_signature_serializer_saves_new_document(self):
        # ToDo: implement EPA's humanReadableDocument that's part
        #  of the electronicSignaturesInfo body
        pass
