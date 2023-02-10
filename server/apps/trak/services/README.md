# Services

The services module encapsulates Haztrak's use cases. The services are divided by subdomain and placed in a class. A use
case will have public method as its entry point.

## Use Case Naming convention

Try to follow the following conventions when naming public service methods:

1. `<action>_<resource>`
   The standard naming convention for our services, where <action> is usually what's being done to <resouce>. For
   example,

```python
def sign_manifest(self, mtn: str):
    pass
```

2. `<action>_rcra_<resource>` is used to indicate that this use case will be sending requests to RCRAInfo. so we would
   expect the following function to try to sign a manifest through the RCRAInfo/e-Manifest web services.

```python
def sign_rcra_manifest(self, mtn: str):
    pass
```

3. There are exceptions. For example, the RcrainfoService is really just a wrapper (inherits) around the emanifest PyPI
   package's RcrainfoClient class used to send http requests to RCRAInfo/e-Manifest. This service is only used a
   dependency for other use cases.
