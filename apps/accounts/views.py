from django.contrib import messages
from django.contrib.auth import (update_session_auth_hash)
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import (PasswordChangeForm)
from django.shortcuts import redirect, render

from .forms import UpdateProfileForm, UpdateUserForm
from .models import Profile


@login_required
def profile_view(request):
    if request.method == 'POST':
        if 'update_profile' in request.POST:
            profile_form = UpdateUserForm(request.POST, instance=request.user)
            if profile_form.is_valid():
                profile_form.save()
                messages.success(request, "Profile updated successfully")
                return redirect('profile')
            else:
                messages.error(request, "error: invalid submission")
                return redirect('profile')
        elif 'update_api' in request.POST:
            api_form = UpdateProfileForm(request.POST, instance=request.user.profile)
            if api_form.is_valid():
                api_form.save()
                messages.success(request, "RCRAInfo API ID and Key updated")
                return redirect('profile')
            else:
                messages.error(request, "error: invalid submission")
                return redirect('profile')
        elif 'update_pw' in request.POST:
            pw_form = PasswordChangeForm(request.user, request.POST)
            if pw_form.is_valid():
                pw_form.save()
                update_session_auth_hash(request, user=request.user)
                messages.success(request, "Password successfully updated. WooHoo!")
                return redirect('profile')
            else:
                messages.add_message(request, 41, "error: Password not changed",
                                     extra_tags='danger')
                return redirect('profile')
    else:
        pw_form = PasswordChangeForm(request.user)
        api_form = UpdateProfileForm(instance=request.user.profile)
        profile_form = UpdateUserForm(instance=request.user)
        profile = Profile.objects.get(user=request.user)
        sites = profile.epa_sites.all()
        return render(request, 'accounts/profile.html',
                      {'api_form': api_form,
                       'form': profile_form,
                       'pw_form': pw_form,
                       'user': request.user,
                       'sites': sites})
