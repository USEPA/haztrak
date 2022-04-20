import json
import logging
import os

from apps.trak.models import Manifest, Handler


def from_json_file(json_file):
    try:
        if os.path.exists(json_file):
            with open(json_file, 'rt') as open_file:
                data = json.loads(open_file.read())
        gen_object = Handler.objects.create(**data['generator'])
        data['generator'] = gen_object
        return Manifest.objects.create(**data)
    except IOError:
        logging.error(f'File {json_file} could not be opened')
