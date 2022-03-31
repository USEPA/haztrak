from django import forms
from django.contrib.auth.models import User
from .models import Profile


class UpdateProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['user', 'rcra_api_id', 'rcra_api_key']
