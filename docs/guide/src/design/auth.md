# Authentication and Authorization

This project makes extensive use of the Django authentication and authorization system.
This document does not provide a overview of Django's auth systems, for more information,
see the [Django documentation](https://docs.djangoproject.com/en/5.0/topics/auth/).

## Authentication

This open source project tries to keep the authentication system simple.
This project uses what's provided Django's built-in authentication system, as well as the Django Rest Framework.

## Authorization

Authorization, for this project, requires a complex set of permissions to be implemented.
The requirements for granting access to a resources (e.g., a manifest) are determined on
a per-user, per-role, per-object, per-object status basis.

As an example scenario, a user wants to edit a manifest. The following applies:

1. The user must be authenticated.
2. The user must have access to a site listed on the manifest.
3. The user must have the appropriate role to edit the manifest, for the site.
4. The manifest must be in a status that allows editing.

Therefore, determining whether a user has access is a dynamic process. In addition, the permissions

## Specification

The system must:

1. Define a `Site` model that represents one of the client's sites/locations.
   The site has a one-to-one relationship with a `RcraSite` model.
2. Define an `Organization` model that represents a client's organization. The organization
   has a one-to-many relationship with the `Site` model.
3. Define a `User` model that represents a user.
4. Define a `UserRole` model that represents a role that a user can have for a site or organization.
   A user can have multiple user roles. A user role has a one-to-one relationship with a `Role` model.
5. Define a `Role` model that represents the function/job/actions that a user has. A role has a one-to-many
   relationship with a `Permission` model.
6. Define a `Permission` model that represents the actions that a user can perform.
