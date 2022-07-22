[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)
[![Test Haztrak Backend](https://github.com/USEPA/haztrak/actions/workflows/test_backend.yml/badge.svg)](https://github.com/USEPA/haztrak/actions/workflows/test_backend.yml)
[![Front end Tests](https://github.com/USEPA/haztrak/actions/workflows/test_frontend.yml/badge.svg)](https://github.com/USEPA/haztrak/actions/workflows/test_frontend.yml)
___

# Haztrak

Haztrak is a example web-application that aims to showcase
how [hazardous waste](https://www.epa.gov/hw) management software can interface with and leverage
the resources exposed by EPA's [RCRAInfo](https://rcrainfo.epa.gov/), more specifically e-Manifest,
webservices.

### About e-Manifest

June 30, 2018. EPA launched a national system for tracking hazardous waste shipments electronically,
this system, known as "[e-Manifest](https://www.epa.gov/e-manifest)," modernizes the nation’s
cradle-to-grave hazardous waste tracking process while saving valuable time, resources, and dollars
for industry and states.

e-Manifest, a modular component of EPA's [RCRAInfo](https://rcrainfo.epa.gov/), can be accessed by
it's users a few ways...

1. Through your favorite web browser at https://rcrainfo.epa.gov/
2. Via the RCRAInfo RESTful application programming interface (API)

Haztrak aims to showcase how hazardous waste handlers can utilize the later in their own waste
management software.

For more information on using the RCRAInfo and e-Manifest web services, please see the
[USEPA/e-Manifest](https://github.com/USEPA/e-manifest) repo or contact the
[e-Manifest Team](https://www.epa.gov/e-manifest/forms/contact-us-about-hazardous-waste-electronic-manifest-system)
. This project would not be possible without the incredible work done by the EPA e-Manifest Team.

## Getting Started

- See [docs/contributing](https://github.com/USEPA/haztrak/blob/main/docs/CONTRIBUTING.md) for a
  guide on setting up a development environment and contributing your work upstream.
- See the [haztrak/issues](https://github.com/USEPA/haztrak/issues) to report a problem, request a
  feature, or find something to work on.
    - Just starting out? We try keeping the
      [Good First Issue](https://github.com/USEPA/haztrak/labels/good%20first%20issue) label up to
      date

## Documentation

See the README.md for the [Django back end](./backend/README.md)
and [React front end](./frontend/README.md) in their respective directories for a high level
overview.

We plan on additional developer documentation in the [docs](./docs) directory, which contain
theoretical workflows for using the RCRAInfo services.

Lastly, we will try to keep a healthy dose of inline comments in the codebase. See the documentation
Project Structure section if looking for documentation on specific functionality and where to find
that in the codebase.

## Development Status

Haztrak is **not** a polished, ready-to-ship product. it's intended audience are those looking
to see a working example and those who have the technical expertise to leverage this
open-source code for their own requirements. It's licensed under under
the [MIT open source](./LICENSE)
license, a permissive license designed to provide you(!) the freedom to use, modify, redistribute,
even develop proprietary derivative works.

As of July 2022, we are currently focusing on converting the project from a server-side rendered
application to a client-side rendered (AKA
[single page application](https://www.google.com/search?q=single%20page%20applications))
architecture. It remains a work in progress for the time being.

---
Extensive Documentation to come*
