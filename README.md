[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)
![haztrak tests](https://github.com/dpgraham4401/haztrak/actions/workflows/haztrak_test.yml/badge.svg)

# Haztrak
Haztrak is a simple web application that aims to showcase how hazardous waste handlers can integrate their systems with
EPA's RCRAInfo and e-Manifest system.

### Areas in need of help
- see the [dpgraham4401/haztrak/issues](https://github.com/dpgraham4401/haztrak/issues) to report or find something to work on
- see [docs/contributing](https://github.com/dpgraham4401/haztrak/blob/main/docs/CONTRIBUTING.md) guide for tips on getting started

### The Stack
- Python
    - The Django Framework (> 4.0)
    - The Django Rest Framework (> 3.13)
    - [emanifest client API library](https://github.com/USEPA/e-manifest/tree/master/emanifest-py)
- PostgreSQL (TBD)
    - currently we're still making so many modifications it does not make sense to setup something besides SQLite.
      However, the django framework tends to favor the use of Postgres, and while we currently have not made any design
      decisions that would force use of one db over another, I expect we will.
- The Bootstrap Library (4.6)
