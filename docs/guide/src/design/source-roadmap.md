# Source Roadmap

We know that finding your way around a larger codebase can be intimidating, where do you
start?
To that end, this overview will hopefully get you started looking in the right
directory.

```
├── /configs                : Example configuration
├── docker-compose.yaml     : Docker compose file for starting
├── runhaz.sh               : Convenience shell script
├── /client                 : Root for the React Browser SPA client
│   ├── /public             : Entry point and static assets
│   └── /src
│       ├── /components     : React componets and building blocks
│       ├── /features       : Higher level components
│       ├── /hooks          : Custon hooks
│       ├── /services       : Library for consuming web services
│       ├── /store          : Redux store slices and logic
│       ├── /test           : tests utilties like MSW
│       └── /types          : Project Type definitions
└── /server                 : Root for the Django http server
    ├── /apps               : Container for django 'apps'
    │   ├── /core           : Django related items used by all apps, such as auth
    │   │   ├── exceptions.py : Universal custom error handlers
    │   │   └── managemet   : Custom Haztrak manage.py commands
    │   └── /trak           : HW tracking Django app
    │       ├── migrations  : Database migration
    │       ├── models      : Table/Model definitions for database persistence
    │       ├── serializers : DRF serializers for model to/from JSON representation
    │       ├── services    : Business logic for our app
    │       ├── tasks       : Celery tasks, used to asynch interface with RCRAInfo
    │       ├── tests       : Our Django app specific tests
    │       └── views       : Our Django (DRF) views
    ├── /fixtures           : Initial data loaded on start
    └── /haztrak            : Django setting module
```

## Notable Directories

[`server/apps`](https://github.com/USEPA/haztrak/tree/main/server/apps/trak)
This directory houses all our Django apps, really just for organizational purposes.

[`server/apps/trak`](https://github.com/USEPA/haztrak/tree/main/server/apps/trak)
A Django reusable app that contains models related to hazardous waste tracking (electronic manifests)
It depends on the `sites` app, the Handler model contains a foreign key to the RcraSite model (many-to-one relationship).

[`server/apps/sites`](https://github.com/USEPA/haztrak/tree/main/server/apps/trak)
A Django reusable app that contains models related to RCRAInfo sites.

[`client/src/features`](https://github.com/USEPA/haztrak/tree/main/client/src/features)
This directory, theoretically, contains the high level logic for
rendering haztrak components, consumes the redux store slices.

[`client/src/components`](https://github.com/USEPA/haztrak/tree/main/client/src/components)
This directory (should) only contains basic components that are
primarily act as building blocks. Some of these components are
simple wrappers around [react-bootstrap](https://react-bootstrap.github.io/) components.
