How to contribute to `haztrak`
================================

### Bugs or Questions?

* Submit an issue
  on [the Issues page](https://github.com/dpgraham4401/haztrak/issues)

### Code contributions

* Fork this repo to your GitHub account
* Clone your fork to your machine,
    * e.g,. `$ git clone git@github.com/<yourgithubusername>/haztrak.git`
* Make sure to track upstream progress
    * `$ git remote add upstream https://github.com/dpgraham4401/haztrak.git`
    * Before making changes make sure to pull upstream changes
        * `$ git fetch upstream` then merge later or just `$ git pull upstream`
* Make your changes
    * If you are adding or changing functionality, include new
      tests, and make sure those pass before submitting
      the PR.
    * `$ python manage.py test`
* Push changes to your account
* Submit a pull request to home base at `dpgraham4401/haztrak`

### Setting up a development environment

* To make life a little easier, we've included a couple configs to help get a
  development environment setup
    * `.editorconfig`
        * If using an IDE that supports these uniform config,
          please install the plugin if necessary. This will make your life
          easier
          and ensure your IDE is not reformatting files differently than
          upstream.
    * `requirements_dev.txt`
        * Installing this will install development
          dependencies into your current environment along with packages from
          requirements.txt
    * pre-commit
        * [pre-commit](https://pre-commit.com/) hooks are set to run a number
          of linting and formatting checks before commits on any branch is
          accepted.
        * Git hooks are not included with the repo, to install them locally (
          after installing the dev dependencies) run `$ pre-commit install`
        * Hooks can
          be [temporarily disabled](https://pre-commit.com/#temporarily-disabling-hooks)
          with `$ git commit --no-verify`
    * `runhaz.sh`
        * A bash script to help with development
        * Try `./runhaz.sh -h` for usage
