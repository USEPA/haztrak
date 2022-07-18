# Haztrak Front End

___

This directory contains half of the Haztrak web-app; the user-interface! If you're looking for a
holistic overview of the Haztrak project, check the [README](../README.md) in the root directory or
the [docs/](../docs) for greater detail.

### Project Scope

Diving into an explanation
of [client-side rendered web-apps](https://www.google.com/search?q=single%20page%20applications) is
outside the scope of this documentation. In essence though, the front end is responsible for a
couple things:

1. Dynamically rendering/displaying the user-interface in the browser
2. Talking to the Haztrak server (requesting/sending data)

Currently, the front end does not directly interface with [RCRAInfo](https://rcrainfo.epa.gov), This
means every interaction with RCRAInfo requires that the user sends a request to Haztrak's backend,
which is turn sends a request to RCRAInfo, and the response follows the reverse path back to the end
user. While arguably inefficient, this keeps the user's
RCRAInfo [API](https://www.google.com/search?q=API) ID and Key (i.e., sensitive info) on the
Haztrak server instead of the browser.

### How's it made

Laboriously.
But if you're interested in what frameworks and libraries it uses...

* [React](https://reactjs.org/)
* [Redux](https://redux.js.org/)
* [Bootstrap / React-bootstrap](https://react-bootstrap.github.io/)
* Take look at [package.json](package.json) for more information

It's initial UI is based on Start
Bootstrap's [SB Admin](https://startbootstrap.com/template/sb-admin) template.

# Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app),
using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/)
template.

## Available Scripts

In the `./frontend` directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Instead of the interactive watch mode, we've set `npm test` to launch the test runner with
the `--watchAll=false`\
See the create-react-app's section
about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more
information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for
more information.

To learn React, check out the [React documentation](https://reactjs.org/).
