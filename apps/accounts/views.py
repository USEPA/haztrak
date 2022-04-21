from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.shortcuts import redirect
from django.shortcuts import render

from .forms import UpdateProfileForm, UpdateUserForm
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


# TODO: Remove the serious repetition going on here
@login_required
def profile(request):
    # user_profile = Profile.objects.filter(user=request.user).get()
    if request.method == 'POST':
        if 'update_profile' in request.POST:
            profile_form = UpdateUserForm(request.POST, instance=request.user)
            if profile_form.is_valid():
                # messages.success(request, 'Profile successfully updated')
                return redirect('profile')
            else:
                return redirect('profile')
        elif 'update_api' in request.POST:
            api_form = UpdateProfileForm(request.POST, instance=request.user.profile)
            if api_form.is_valid():
                api_form.save()
                return redirect('profile')
            else:
                return redirect('profile')
    else:
        api_form = UpdateProfileForm(instance=request.user.profile)
        profile_form = UpdateUserForm(instance=request.user)
        return render(request, 'accounts/profile.html',
                      {'api_form': api_form, 'form': profile_form, 'user': request.user})
