from django.contrib.auth.models import User
from django.test import TestCase


# Create your tests here.
class AccountSignedInTest(TestCase):

    def setUp(self):
        User.objects.create_user(username='username', password='password')
        self.client.login(username='username', password='password')

    def test_sign_up_redirects_user_home(self):
        response = self.client.get('/accounts/signup/', follow=True)
        self.assertEqual(response.status_code, 200)

    def test_sign_up_redirects_no_follow(self):
        response = self.client.get('/accounts/signup/')
        self.assertEqual(response.status_code, 302)

    def test_user_profile_view(self):
        response = self.client.get('/accounts/profile/')
        self.assertEqual(response.status_code, 200)

    def test_login_redirects(self):
        response = self.client.get('/accounts/login/')
        self.assertEqual(response.status_code, 302)


class UnauthorizedSiteViewTest(TestCase):

    def test_non_user_can_view_signup(self):
        response = self.client.get('/accounts/signup/')
        self.assertEqual(response.status_code, 200)

    def test_non_user_cannot_view_profile(self):
        response = self.client.get('/accounts/profile/', follow=False)
        self.assertEqual(response.status_code, 302)

    def test_non_user_profile_redirects(self):
        response = self.client.get('/accounts/profile/', follow=True)
        self.assertEqual(response.status_code, 200)

    def test_login_for_non_user(self):
        response = self.client.get('/accounts/login/')
        self.assertEqual(response.status_code, 200)
