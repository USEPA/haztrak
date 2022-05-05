How to contribute to `haztrak`
================================

### Bugs or Questions?

* Submit an issue
  on [the Issues page](https://github.com/dpgraham4401/haztrak/issues)

### Code contributions

* Fork this repo to your Github account
* Clone your version on your account down to your machine from your account,
  e.g,. `$ git clone git@github.com/<yourgithubusername>/haztrak.git`
* Make sure to track progress upstream (i.e., on our version of `haztrak`
  at `jhollist/quickmapr`) by
  doing `$ git remote add upstream https://github.com/dpgraham4401/haztrak.git`
  Before making changes make sure to pull changes in from upstream by doing
  either `$ git fetch upstream` then merge later or `$ git pull upstream` to
  fetch
  and merge in one step
* Make your changes (bonus points for making changes on a new branch)
    * install the pre-commit hooks
    * `$ pip install pre-commit`
    * `$ pre-commit install`
    * If you are adding or changing functionality, include new
      tests, and make sure those pass before submitting
      the PR.
    * `$ python manage.py test`
* Push up to your account
* Submit a pull request to home base at `dpgraham4401/haztrak`

### Setting up a development environment

* To make life a little easier, we've included a couple configs to help get a
  development environment setup
    * `.editorconfig` if using an IDE that supports these uniform config,
      please install the plugin if necessary. This will make your life easier
      and ensure your IDE is not reformatting files differently that upstream.
    * `requirements_dev.txt` installing this will install development
      dependencies into your current environment along the packages from
      requirements.txt
    * `.pre-commit-config.yaml` config file used by pre-commit which is
      installed with `$ pip install -r requirements_dev.txt`
        * [pre-commit](https://pre-commit.com/) hooks are set to run a number
          of linting and formatting checks before commits on any branch is
          accepted.
        * git hooks are not included with the repo, to install them locally (
          after installing the dev dependencies) run `$ pre-commit install`
        * hooks can
          be [temporaily disabled](https://pre-commit.com/#temporarily-disabling-hooks)
          with `$ git commit --no-verify`
