from django.shortcuts import render
from django.contrib.auth.forms import UserCreationForm


def signup(request):
    return render(request, 'accounts/signup.html',
                  {'form':UserCreationForm})


def profile(request):
    return render(request, 'accounts/profile.html')
