# Source Structure

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
    │   ├── /accounts       : User management
    │   └── /trak           : Everything needed to interface with RCRAInfo
    ├── /fixtures           : initial data used
    ├── /haztrak            : Django setting module
    └── /lib                : High livel RCRAInfo interfacing logic
```

## Notable Directories

[`/server/apps/trak`](https://github.com/USEPA/haztrak/tree/main/server/apps/trak)
This is a Django reusable app, it's self-encapsulating, it contains
all the necessary models, serializers, views use electronic manifests.

[`client/src/features`](https://github.com/USEPA/haztrak/tree/main/client/src/features)
This directory, theoretically, contains the high level logic for
rendering haztrak components, consumes the redux store slices.

[`client/src/components`](https://github.com/USEPA/haztrak/tree/main/client/src/components)
This directory (should) only contains basic components that are
primarily act as building blocks. Some of these components are
simple wrappers around [react-bootstrap](https://react-bootstrap.github.io/) components.
