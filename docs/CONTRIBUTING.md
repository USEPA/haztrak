# How to contribute to `haztrak`

You are cordially invited to contribute to haztrak.

### Bugs or Questions?

- Submit [an Issues](https://github.com/USEPA/haztrak/issues),
  we love input in general, and we're happy to answer any questions.
- It's best to ask clarifying questions, via an issue or discussion, before starting
  work or submitting a PR. we also welcome draft PRs.

### Code contributions

If you're looking to contribute code or documentation, here's the general process...

- Ask to be assigned an [Issues](https://github.com/USEPA/haztrak/issues).
- Fork this repo to your GitHub account.
- Clone your fork to your local workstation.
  - e.g,. `$ git clone git@github.com/<yourgithubusername>/haztrak.git`
- Add [USEPA/haztrak](https://github.com/USEPA/haztrak) as a remote and track upstream
  changes.
  - `$ git remote add upstream https://github.com/USEPA/haztrak.git`
    - `$ git fetch upstream` then merge later or just `$ git pull upstream`
  - Or keep your fork in sync
- Create a new branch and make your changes.
  - If you are adding or changing haztrak's functionality, include new test(s) and
    make sure they
    pass
  - before submitting your pull request...
    - Update the documentation.
    - Run all tests.
      - `$ ./runhaz -t` is a convenience script to run all test.
    - Resolve merge conflicts with upstream, please and thank you.
- Push changes to your account's fork
- Submit a pull request to [USEPA/haztrak](https://github.com/USEPA/haztrak/pulls)

### Setting up a development environment

- To make life a little easier, we've included a couple configs to help get a
  development environment setup.
- `.editorconfig`

  - Universal IDE configs for formatting files, most IDEs will have a plugin you can
    install

- pre-commit

  - [pre-commit](https://pre-commit.com/) hooks are set to run a number
    of linting and formatting checks before commits on any branch is
    accepted.
  - Install [pre-commit](https://pre-commit.com/) on your workstation
  - In the root directory, run `$ pre-commit install`
    - Alternatively, `$ ./runhaz.sh -p` will install and run the hooks

- `runhaz.sh`

  - A bash script to help with development
  - See usage with `$ ./runhaz.sh -h`

- `Prettier`
  - [Prettier](https://prettier.io/) is used to autoformat source files, specifically
    the
    front end for now. If you're using an IDE, it likely have a prettier plugin
    available.
  - The configs are found in [.prettierrc.json](/client/.prettierrc.json)
    and [.prettierignore](/client/.prettierignore)
