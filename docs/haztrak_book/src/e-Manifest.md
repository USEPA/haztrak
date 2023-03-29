# About e-Manifest

June 30, 2018. the [United States Environmental Protection Agency](https://www.epa.gov) (USEPA or EPA)
launched a national system for tracking hazardous waste shipments
electronically, this system, known as "[e-Manifest](https://www.epa.gov/e-manifest),"
modernizes the nation’s paper-intensive process for tracking hazardous waste from cradle
to grave while saving valuable time, resources, and dollars for industry and states.

e-Manifest is a modular component of [RCRAInfo](https://rcrainfo.epa.gov/) which can be
accessed by its users in two ways:

1. Through their favorite web browser at https://rcrainfo.epa.gov/
2. Via the RCRAInfo RESTful application programming interface (API)

Haztrak aims to showcase how hazardous waste handlers can utilize the latter in their
own waste management software. In particular, Haztrak aims to facilitate using electronic manifests without the need
to log into RCRAInfo through a browser.

This project would not be possible without the work of the EPA e-Manifest Team.

## e-Manifest Background

If you're looking for background information on the e-Manifest Program, you can find
up-to-date information on the [EPA's e-Manifest
page](https://www.epa.gov/e-manifest).

If you're new to e-Manifest, you may want to review the [Terminology page](./terminology.md).

The e-Manifest and RCRAInfo team also communicates changes to the e-Manifest system
with biweekly virtual user calls
and [monthly webinars](https://www.epa.gov/e-manifest/monthly-webinars-about-hazardous-waste-electronic-manifest-e-manifest).
Links to the biweekly user call can be obtained by subscribing
via [govdelivery](https://public.govdelivery.com/accounts/USEPAORCR/subscriber/new).

## e-Manifest Documentation

The e-Manifest team maintains a public repository on GitHub at [USEPA/e-Manifest](https://github.com/USEPA/e-manifest)
that contains documentation on the RCRAInfo web services, as well as the
[emanifest](https://pypi.org/project/emanifest/) python library to help use the RCRAInfo
web services. For help, please visit the repo or contact the [e-Manifest Team](https://www.epa.gov/e-manifest/forms/contact-us-about-hazardous-waste-electronic-manifest-system)
.

## RCRAInfo Pre-Production Environment

The RCRAInfo (and by extension e-Manifest) team make the pre-production
environment available for user testing and development. In order to develop and test
much of Haztrak's RCRAInfo-facing functionality, you will need an account with API
credentials to this environment and the appropriate permissions for sites you would
like to use for testing purposes.

For information on how to access the RCRAInfo preprod environment, see the
[e-Manifest How to Participate](https://www.epa.gov/e-manifest/how-participate-testing-hazardous-waste-electronic-manifest-system-e-manifest)
page. You can find information on the RCRAInfo user roles in the [e-Manifest FAQs
here](https://www.epa.gov/e-manifest/frequent-questions-about-e-manifest#user_question6).
