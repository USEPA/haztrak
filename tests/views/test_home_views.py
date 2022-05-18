from django.test import TestCase


class HomeViewTest(TestCase):

    def test_home_url_exists(self):
        response = self.client.get('/', follow=True)
        self.assertEqual(response.status_code, 200)

    def test_about_url_exists(self):
        response = self.client.get('/about/')
        self.assertEqual(response.status_code, 200)
