import logging

from django.test import TestCase

logger = logging.getLogger(__name__)


class TestLogSettings(TestCase):

    def test_default_settings(self):
        with self.assertLogs(__name__) as logs:
            logger.warning('food')
            print(logs)
        # with self.assertLogs(level='INFO') as logs:
        #     logger.error('foo')
        #
        #     print('output ', logs.output)
        # self.assertIn(
        #     message,
        #     log_watcher.output[0]
        # )

    # def test_default(self):
    #     # logger = logging.getLogger(__name__)
    #     print(str(logger))
    #     # logger.debug('debug')
    #     # logger.info('info')
    #     logger.warning('warning')
    #     # logger.error('error')
    #     # logger.critical('critical')
    #     assert True
