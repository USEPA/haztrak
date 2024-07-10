# Authentication and Authorization

This project makes extensive use of the Django authentication and authorization system.
This document does not provide a overview of Django's auth systems, for more information,
see the [Django documentation](https://docs.djangoproject.com/en/5.0/topics/auth/).

## Authentication

This project makes use of Django's built-in authentication system `django.contrib.auth` and the
packages in the Django ecosystem (e.g., `django-allauth`) to authenticate users.

We do not rely on external authentication services for this project to keep the project focused,
avoid condoning a third-party service (as the U.S. government). This also provides an
opportunity to demonstrate how systems can implement auth to use features of the e-Manifest system
such as the Remote Signer policy and generally allowing their internal users electronically manifest
without having an account in the US EPA's RCRAInfo/e-Manifest system.

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

### Python/Django Implementation Notes

The Django framework ships with a built-in authentication and authorization system.
The components of this built in system are found
under the `django.contrib.auth` package. Leveraging the built-in system would allow us to
take advantage of the many features that Django (such as the admin interface) provides and would
ensure that we are using a well-tested, battle-hardened system.

However, to quote
[Customizing Django Authentication docs](https://docs.djangoproject.com/en/stable/topics/auth/customizing/#handling-object-permissions),

> Django’s permission framework has a foundation for object permissions, though there is no implementation for it in the
> core. That means that checking for object permissions will always return False or an empty list (depending on the
> check performed). An authentication backend will receive the keyword parameters obj and user_obj for each object
> related authorization method and can return the object level permission as appropriate.

Object level permissions is a required feature for this project. There are 2 noteworthy packages
that aim to provide object level permissions:

1. [django-guardian](https://django-guardian.readthedocs.io/en/stable/)
2. [django-rules](https://github.com/dfunckt/django-rules)

As of this writing, the django-guardian package is mature, and widely used. However, it is not actively maintained.
The django-rules package is actively maintained, but it is not as widely used as django-guardian.
