# Haztrak Front End

### What is the Haztrak Front-end?

This directory contains half of the Haztrak web-app; the user-interface!
If you're looking for a holistic overview of the Haztrak project, check
the [README](../README.md) in the root directory or the [docs/](../docs) for
greater detail.

### What it does

Diving into an explanation
of [client-side rendered web-apps](https://www.google.com/search?q=single%20page%20applications)
is outside the scope of this documentation. In essence though, the front end is
responsible for a couple things:

1. Dynamically rendering the user-interface in the browser
2. Talking to the Haztrak server (request/send data)

Currently, the front end does not directly talk
to [RCRAInfo](https://rcrainfo.epa.gov),
This means every interaction with RCRAInfo
requires that the user sends a request to Haztrak's backend, which is turn sends
a request to RCRAInfo, and the response follows the reverse path back to the end
user. While arguably inefficient, this keeps the user's
RCRAInfo [API](https://www.google.com/search?q=API) ID and Key (i.e., username &
password) on the Haztrak server.

### How's it made

Laboriously.
But if you're interested in what frameworks and libraries it uses...

* [React](https://reactjs.org/)
* [Redux](https://redux.js.org/)
* [Bootstrap / React-bootstrap](https://react-bootstrap.github.io/)
* Take look at [package.json](package.json) for more information

It's initial UI is based on Start
Bootstrap's [SB Admin](https://startbootstrap.com/template/sb-admin) template.
