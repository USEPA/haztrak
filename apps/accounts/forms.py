from django import forms
from django.contrib.auth.models import User

from .models import Profile


class UpdateProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['rcra_api_id', 'rcra_api_key']
        widgets = {
            'rcra_api_key': forms.PasswordInput()
        }


class UpdateUserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']
