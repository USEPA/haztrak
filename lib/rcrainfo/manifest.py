import io
import logging
import sys
from rest_framework.exceptions import ValidationError
from apps.api.serializers import ManifestSerializer
from rest_framework.parsers import JSONParser


# utility function primarily used for loading test data from a file
# relies the apps.api.serializer.ManifestSerializer
def serializer_from_file(json_file) -> ManifestSerializer:
    """"""
    try:
        with open(json_file, 'rb') as open_file:
            data = open_file.read()
        stream = io.BytesIO(data)
        data = JSONParser().parse(stream=stream)
        serializer = ManifestSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return serializer
    except IOError:
        logging.error(f'{json_file} not found')
        sys.exit(1)
    except ValidationError:
        logging.error(f'Validation Error when serializing {json_file}')
