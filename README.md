[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)
![haztrak tests](https://github.com/USEPA/haztrak/actions/workflows/haztrak_test.yml/badge.svg)

# Haztrak

___

Haztrak is a example web-application that aims to showcase
how [hazardous waste](https://www.epa.gov/hw) management software can interface with
EPA's [RCRAInfo](https://rcrainfo.epa.gov/) and, more specifically, the e-Manifest module of
RCRAInfo.

It is **not** a polished, ready-to-ship product. it's intended audience are those looking
to see a working example and those who have the technical expertise to leverage this
open-source code for own requirements. It's licensed under under the [MIT open source](./LICENSE)
license, a permissive license designed to provide you(!) the freedom to use, modify, redistribute,
even develop proprietary derivative works.

As of July 2022, we are currently focusing on converting the project from a server-side rendered
application to a client-side rendered (AKA
[single page application](https://www.google.com/search?q=single%20page%20applications))
architecture. It remains a work in progress for the time being. Haztrak would not be possible
without the work done by the EPA e-Manifest Team. For up-to-date documentation on using
RCRAInfo/e-Manifest web services, see
the [USEPA/e-Manifest](https://github.com/USEPA/e-manifest) repo or contact the
[e-Manifest Team](https://www.epa.gov/e-manifest/forms/contact-us-about-hazardous-waste-electronic-manifest-system)
.

## The Stack

Haztrak could aptly be described as a two separate projects, currently, hosted in the same repo;
the [frontend](./frontend) and the [backend](./backend). For more details on each part,
see the README in each respective directory, or see our [documentation](./docs).

The decoupling of front end and back end has a few advantages, the biggest one being that one can be
used without the other.
For example, if you would like to use the backend as a starting point for your own work but the
frontend does not meet your business requirements, you could swap out Haztrak's frontend for your
own (or vice-versa). This seperated design is also more scalable, for example, one backend could
service multiple
frontends (e.g., a web-app and a mobile-app simultaneously).

## Contribute

- See [docs/contributing](https://github.com/USEPA/haztrak/blob/main/docs/CONTRIBUTING.md) for a
  guide getting started a development environment set up and contributing your work upstream.
- See the [haztrak/issues](https://github.com/USEPA/haztrak/issues) to report a problem, request a
  feature, or find something to work on.
    - Just starting out? We try keeping the
      [Good First Issue](https://github.com/USEPA/haztrak/labels/good%20first%20issue) label up to
      date

## Useful Links

### Documentation

### About e-Manifest
