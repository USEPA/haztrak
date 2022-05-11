from django.contrib.auth.models import User
from django.test import TestCase

from apps.accounts.models import Profile


class AccountSignedInTest(TestCase):

    def setUp(self):
        user1 = User.objects.create_user(username='username', password='password')
        profile1 = Profile.objects.filter(user_id=user1.id).get()
        profile1.rcra_api_id = 'some_fake_id'
        profile1.rcra_api_key = 'some_fake_key'
        profile1.save()
        self.client.login(username='username', password='password')
        User.objects.create_user(username='my_username', password='my_password')

    def test_user_model_successfully_created(self):
        user1 = User.objects.filter(username='username').get()
        self.assertIsNotNone(user1)

    def test_profile_created_with_user(self):
        user1 = User.objects.filter(username='username').get()
        self.assertIsNotNone(Profile.objects.filter(user=user1).get())

    def test_profile_created_without_profile_touch(self):
        user2 = User.objects.filter(username='my_username').get()
        self.assertIsNotNone(Profile.objects.filter(user=user2).get())

    def test_profile_with_api_id_is_saved(self):
        profile1 = filter_profile_by_username('username')
        self.assertEqual(profile1.rcra_api_id, 'some_fake_id')

    def test_profile_with_api_key_is_saved(self):
        profile1 = filter_profile_by_username('username')
        self.assertEqual(profile1.rcra_api_key, 'some_fake_key')

    def test_initial_rcrainfo_api_id_is_none(self):
        user2 = User.objects.filter(username='my_username').get()
        self.assertIsNone(Profile.objects.filter(user=user2).get().rcra_api_id)

    def test_initial_rcrainfo_api_key_is_none(self):
        user2 = User.objects.filter(username='my_username').get()
        self.assertIsNone(Profile.objects.filter(user=user2).get().rcra_api_key)

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


def filter_profile_by_username(username: str):
    user = User.objects.filter(username=username).get()
    return Profile.objects.filter(user_id=user.id).get()
