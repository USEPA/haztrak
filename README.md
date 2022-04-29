# Haztrak

If you're reading this, this project is in such an early stage it doesn't even merit versioning

haztrak is a simple web application that aims to showcase how hazardous waste handlers can integrate their systems with
EPA's RCRAInfo and e-Manifest system.

### The end goal is to create something that users can...

1. See a functioning example in action
3. Read and easily understand how it functions
5. Extend and make their own
    - Haztrak is distributed under the a permissive license. Feel free to take, adapt and redistribute it!

### Haztrak is not...

1. An out-of-the-box solution
    - Haztrak is not meant for end consumers, those looking to use haztrak should have the necessarily knowledge and
      skills to deploy such a web application on their own.
3. Distributed with warranty of any kind
    - We welcome bug report, issues, patches, etc. However, you should not adopt haztrak with the expectation of
      receiving support from it's developers.

### The Stack

- Python
    - The Django Framework
    - The Django Rest Framework
    - [emanifest client API library](https://github.com/USEPA/e-manifest/tree/master/emanifest-py)
- PostgreSQL (TBD)
    - future work, currently there are so many modifications to our models right now it doesn't make sense to
      migrate from the SQLite default to a real database
- The Bootstrap Library

### Areas in need of help 04/29/2022

1. Database design!!!
    - No idea what i'm doing in this area
    - Would appreciate feedback on the design of the [models captured by the trak app](./apps/trak/models.py)
2. Configs and Deployment
    - Currently there's no separation between configs and the deployment
    - we may want to employ a third party library like [django-env](https://pypi.org/project/django-env/), although i
      don't really want to bring in more dependencies
    - Dockerizing Haztrak
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
