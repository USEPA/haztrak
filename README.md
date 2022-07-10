[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)
![haztrak tests](https://github.com/USEPA/haztrak/actions/workflows/haztrak_test.yml/badge.svg)

# Haztrak

Haztrak is a simple web application that aims to showcase how [hazardous waste](https://www.epa.gov/hw) management
software can interface with EPA's [RCRAInfo](https://rcrainfo.epa.gov/) and, more specifically, the e-Manifest module.

As of 07/2022, we are currently focusing on converting the project architecture from a server-side rendered interface to
a [single page application (SPA)](https://en.wikipedia.org/wiki/Single-page_application) implementation. It
remains a work in progress for the time being.

Haztrak is, and will remain, an open-source example. Please see the [License](./LICENSE) and
the [USEPA/e-Manifest](https://github.com/USEPA/e-manifest) for more information on using the e-Manifest/RCRAInfo
web-services.

## Areas in need of help

- see the [USEPA/haztrak/issues](https://github.com/USEPA/haztrak/issues) to report or find something to work on.
  - Just starting out? try filtering by [Good First Issue](https://github.com/USEPA/haztrak/labels/good%20first%20issue)
- see [docs/contributing](https://github.com/USEPA/haztrak/blob/main/docs/CONTRIBUTING.md) guide for tips on getting
  started

## The Stack

Haztrak is really two separate projects, currently, hosted in the same repo; the [frontend](./frontend) and the
backend (the rest of the repo).

* ### Backend
  * The backend's primary role is two-fold, interface with [RCRAInfo](https://rcrainfo.epa.gov/), and expose resources
    to be consumed and interacted with by the frontend. All interaction with RCRAInfo goes through the backend for
    security purposes (i.e.,
    a [site manager's](https://www.epa.gov/e-manifest/frequent-questions-about-e-manifest#user_question6) RCRAInfo API
    ID and key are not used by the frontend).
    * The Django Framework (> 4.0)
    * The Django Rest Framework (> 3.13)
    * [emanifest client API library](https://github.com/USEPA/e-manifest/tree/master/emanifest-py)
* ### Frontend
  * The frontend is a [React app](https://reactjs.org/) accompanied by supporting
    libraries ([see package.json](./frontend/package.json)) such as Redux for state management, and Bootstrap (>5.0) for
    UI design. The initial UX used Start Bootstrap's [sb admin](https://startbootstrap.com/template/sb-admin) as a
    jump off point.
    * React (>18.1)
    * Redux (>8.0)

This separation has a few advantages, the biggest one being that one can be used with out the other. For example,
the backend could be deployed as a standalone and provide services to multiple frontends (e.g., a mobile app).
