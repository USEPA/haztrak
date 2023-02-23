# Haztrak Client

---

This directory the Haztrak user-interface! If you're looking for a
holistic overview of the Haztrak project, check the [README](/README.md) in the root directory or
the [docs/](/docs) for greater detail.

### What's in this directory?

To oversimplify, the React user-interface is responsible for a couple of things:

1. Dynamically rendering/displaying the user-interface in the browser.
2. Talking to the Haztrak server.

The front end does not directly interface with [RCRAInfo](https://rcrainfo.epa.gov),
every interaction with RCRAInfo requires that the user sends a request to the Haztrak server,
which is turn sends a request to RCRAInfo. The response follows the reverse path back to the end
user. This allows for a better control of what gets sent to RCRAInfo, and also keeps the user's
sensitive data, such as their RCRAInfo API ID and Key, off the user's browser and the network in
general.

### How's it made

The web client makes extensive use of the React ecosystem, namely the below libraries, to
render the user interface, store state, and make request to the haztrak server.

- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [Bootstrap / React-bootstrap](https://react-bootstrap.github.io/)
- Take look at [package.json](package.json) for more information

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app),
using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/)
template.

## Getting Started

Some available scripts to get started

- `npm start`
- `npm test`
- `npm run build`
