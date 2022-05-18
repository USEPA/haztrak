[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)
![haztrak tests](https://github.com/dpgraham4401/haztrak/actions/workflows/django_test.yml/badge.svg)

# Haztrak

If you're reading this, this project is in such an early stage it doesn't even merit versioning

haztrak is a simple web application that aims to showcase how hazardous waste handlers can integrate their systems with
EPA's RCRAInfo and e-Manifest system.

### The end goal is to create something so users can...

1. See a functioning example in action
3. Read and easily understand how it functions
5. Extend and make their own
    - Haztrak is distributed under the a permissive license. Feel free to take, adapt and redistribute it!

### The Stack

- Python
    - The Django Framework (> 4.0)
    - The Django Rest Framework (> 3.13)
    - [emanifest client API library](https://github.com/USEPA/e-manifest/tree/master/emanifest-py)
- PostgreSQL (TBD)
    - currently we're still making so many modifications it does not make sense to setup something besides SQLite.
      However, the django framework tends to favor the use of Postgres, and while we currently have not made any design
      decisions that would force use of one db over another, I expect we will.
- The Bootstrap Library (4.6 [see migrating to BS 5](https://github.com/dpgraham4401/haztrak/issues/18))

### Areas in need of help 04/29/2022

1. Database design!!!
    - No idea what i'm doing in this area
    - Would appreciate feedback on the design of the [models captured by the trak app](./apps/trak/models.py)
2. Configs and Deployment
    - Currently there's no separation between configs and the deployment
    - we may want to employ a third party library like [django-env](https://pypi.org/project/django-env/), although i
      don't really want to bring in more dependencies
    - Dockerizing Haztrak (low priority for now)
3. CI/CD
    - The unittest are improving, and we run all test when pushed to main, always room to grow
    - CD would need to come after the configs and deployment (we need deployable before we can get continuous
      deployment ha!)
4. Documentation
    - As you can see, the [docs](./docs) folder is practically empty
5. Consistency and technical debt
    - Right now we're mixing function and class based views
    - Anyone could probably glance over the codebase and see where things are hard coded
    - Just generally paying down technical debt
6. Pretty much everything else
    - See [dpgraham4401/haztrak/issues](https://github.com/dpgraham4401/haztrak/issues)

### Getting started

- see [docs/contributing](https://github.com/dpgraham4401/haztrak/blob/main/docs/CONTRIBUTING.md) guide
