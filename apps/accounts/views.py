from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.shortcuts import redirect
from django.shortcuts import render

from .forms import UpdateProfileForm
from .models import Profile


def signup_haztrak(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            return redirect('home')
        else:
            return render(request, 'accounts/signup.html',
                          {'form': UserCreationForm})
    else:
        if request.POST['password1'] == request.POST['password2']:
            try:
                user = User.objects.create_user(request.POST['username'],
                                                password=request.POST['password1'])
                user.save()
                login(request, user)
                return redirect('home')
            except IntegrityError:
                return render(request, 'accounts/signup.html',
                              {'form': UserCreationForm, 'error': 'Username exists. Choose a new username'})
        else:
            return render(request, 'accounts/signup.html',
                          {'form': UserCreationForm, 'error': 'Passwords do not match'})


def logout_haztrak(request):
    logout(request)
    return redirect('home')


def login_haztrak(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            return redirect('home')
        else:
            return render(request, 'accounts/login.html',
                          {'form': AuthenticationForm})
    else:
        user = authenticate(request, username=request.POST['username'],
                            password=request.POST['password'])
        if user is None:
            return render(request, 'accounts/login.html',
                          {'form': AuthenticationForm,
                           'error': 'Login failed, check your username and password.'})
        else:
            login(request, user)
            return redirect('home')


@login_required
def profile(request):
    user_profile = Profile.objects.filter(user=request.user).get()
    if request.method == 'POST':
        profile_form = UpdateProfileForm(request.POST, instance=request.user.profile)
        if profile_form.is_valid():
            profile_form.save()
            # messages.success(request, 'Profile successfully updated')
            return redirect(to='profile')
    else:
        profile_form = UpdateProfileForm(instance=request.user.profile)
        return render(request, 'accounts/profile.html', {'profile': user_profile, 'form': profile_form})
