How to contribute to `haztrak`
================================

### Bugs or Questions?

* Submit an issue
  on [the Issues page](https://github.com/USEPA/haztrak/issues)

### Code contributions

* Fork this repo to your GitHub account
* Clone your fork to your machine
    * e.g,. `$ git clone git@github.com/<yourgithubusername>/haztrak.git`
* Make sure to track upstream progress
    * `$ git remote add upstream https://github.com/USEPA/haztrak.git`
    * Before making changes make sure to pull upstream changes
        * `$ git fetch upstream` then merge later or just `$ git pull upstream`
* Make your changes
    * If you are adding or changing functionality, include new tests, and make sure those pass
      before submitting the pull request.
        * `$ ./runhaz -t` will run test for back end, then frontend. It only displays output if exit
          code is not 0
        * `$ python manage.py test` for running django's test
        * `$ npm test` for running create-react-app's test script
* Push changes to your account
* Submit a pull request to home base at `USEPA/haztrak`

### Setting up a development environment

* To make life a little easier, we've included a couple configs to help get a
  development environment setup.
* Global
    * `.editorconfig`
        * Universal IDE configs for formatting files
        * Most IDEs will have a plugin you can install

    * pre-commit
        * [pre-commit](https://pre-commit.com/) hooks are set to run a number
          of linting and formatting checks before commits on any branch is
          accepted.
        * Git hooks are not included with the repo, to install them locally (
          after installing the dev dependencies) run `$ pre-commit install`
            * Alternatively, `$ ./runhaz.sh -p` bash script (see below)
        * Hooks can be [temporarily disabled](https://pre-commit.com/#temporarily-disabling-hooks)
          with `$ git commit --no-verify`

    * `runhaz.sh`
        * A bash script to help with development
        * To run haztrak (both frontend and backend) locally `$ ./runhaz.sh -r`
        * usage: `$ ./runhaz.sh -h`

* Back end
    * `requirements_dev.txt`
        * Installing this will install development dependencies into your current python environment
          along with packages from requirements.txt
        * usage: `pythom -m pip install -r requirements_dev.txt`

* Front end
    * `create-react-app`
        * The front end was bootstrapped with the [create-react-app](https://create-react-app.dev/)
          utility. CRA 'bundles' a lot of dependencies under the hood and exposes the
          npm [scripts](https://create-react-app.dev/docs/available-scripts) we
          need to build, test, and run our react app.
    * `npm`
        * Our current package manage,[npm](https://www.npmjs.com/), comes with the Node.js runtime
          environment, which you'll need to run the front end locally.
        * The [package.json](../frontend/package.json) can be found in the 'frontend' directory.
    * `Prettier`
        * [Prettier](https://prettier.io/) is used to autoformat source files, specifically the
          front end for now. If you're using an IDE, it likely have a prettier plugin available.
        * The configs are found in [.prettierrc.json](../frontend/.prettierrc.json)
          and [.prettierignore](../frontend/.prettierignore)
