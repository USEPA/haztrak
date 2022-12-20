[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Server Tests](https://github.com/USEPA/haztrak/actions/workflows/test_server.yaml/badge.svg)](https://github.com/USEPA/haztrak/actions/workflows/test_server.yml)
[![Client Tests](https://github.com/USEPA/haztrak/actions/workflows/test_client.yaml/badge.svg)](https://github.com/USEPA/haztrak/actions/workflows/test_client.yml)
___

# Haztrak :recycle:

Haztrak is an example web-application that aims to illustrate
how [hazardous waste](https://www.epa.gov/hw) management software can interface with and leverage
the resources exposed by EPA's [RCRAInfo](https://rcrainfo.epa.gov/)
and [e-Manifest](https://github.com/USEPA/e-manifest) systems.

### About e-Manifest

June 30, 2018. EPA launched a national system for tracking hazardous waste shipments electronically,
this system, known as "[e-Manifest](https://www.epa.gov/e-manifest)," modernizes the nation’s
paper-intensive process
for tracking hazardous waste from cradle to grave while saving valuable time, resources, and dollars
for industry and states.

e-Manifest, a modular component of [RCRAInfo](https://rcrainfo.epa.gov/), can be accessed by
its users a few ways...

1. Through your favorite web browser at https://rcrainfo.epa.gov/
2. Via the RCRAInfo RESTful application programming interface (API)

Haztrak aims to showcase how hazardous waste handlers can utilize the latter in their own waste
management software.
In Particular, using electronic manifest without the need to log into RCRAInfo through a browser.

For more information on using the RCRAInfo and e-Manifest web services, please see the
[USEPA/e-Manifest](https://github.com/USEPA/e-manifest) repo or contact the
[e-Manifest Team](https://www.epa.gov/e-manifest/forms/contact-us-about-hazardous-waste-electronic-manifest-system)
.
This project would not be possible without the work of the EPA e-Manifest Team.

## Getting Started :rocket:

- looking to try haztrak or set up a local development
  environment? [See our documentation on built-in options to deploy](docs/README.md#deployment)

Looking to contribute?

- For a high level overview of the project components, configuration, diagrams, see
  our [documentation](https://github.com/USEPA/haztrak/tree/main/docs).
- See the [guide on submit a PR](https://github.com/USEPA/haztrak/blob/main/docs/CONTRIBUTING.md).
- [Report an issue, request a feature, or find something to work on](https://github.com/USEPA/haztrak/issues)
  .
    - Just starting out? We try to keep
      the [Good First Issue](https://github.com/USEPA/haztrak/labels/good%20first%20issue) label up
      to date

## Documentation :page_facing_up:

See the README's in the [server](server/README.md) and [client](client/README.md) directories for a
high level
overview.

We plan on more robust developer documentation in the [./docs](./docs) directory, which contain
theoretical workflows for using the RCRAInfo services.

Lastly, since this is intended to be first and foremost an example web application,
we will work to keep a healthy dose of inline comments in the codebase.

## Development Status :warning:

Haztrak is **NOT** intended to be a polished, ready-to-ship, web app. it's intended audience are
those seeking
a working example with the technical expertise to leverage the source for their own requirements.
It's licensed under the [MIT open source](./LICENSE) license, a permissive license designed to
provide you(!)
the freedom to use, modify, redistribute, even develop proprietary derivative works.

## Disclaimer

The United States Environmental Protection Agency (EPA) GitHub project code
is provided on an "as is" basis and the user assumes responsibility for its
use. EPA has relinquished control of the information and no longer has
responsibility to protect the integrity, confidentiality, or availability
of the information. Any reference to specific commercial products,
processes, or services by service mark, trademark, manufacturer, or
otherwise, does not constitute or imply their endorsement, recommendation
or favoring by EPA. The EPA seal and logo shall not be used in any manner
to imply endorsement of any commercial product or activity by EPA or
the United States Government.
