# Authentication and Authorization

This project makes extensive use of the Django authentication and authorization system.
This document does not provide a overview of Django's auth systems, for more information,
see the [Django documentation](https://docs.djangoproject.com/en/5.0/topics/auth/).

## Authentication

This project makes use of Django's built-in authentication system `django.contrib.auth` and the
packages in the Django ecosystem (e.g., `django-allauth`, `django-guardian`).

We do not rely on external authentication services for this project to keep the project focused,
avoid advertising a third-party service (as the U.S. government).

## Authorization

Authorization is relatively complex for this project. Access to a resources (e.g., a manifest)
is a dynamic process and needs to be determined on a per-user + per-role +
per-object + per-object status basis.

As an example scenario, a user wants to edit a manifest. The following applies:

1. The user must be authenticated.
2. The user must have access to a site listed on the manifest.
3. The user must have the appropriate role/permission to edit the manifest.
4. The manifest must be in a status that allows editing.
5. The specific edits must be allowed by e-Manifest.

Haztrak uses `django-guardian` for per-object permissions, to control site access and related
resources.
