# Contributing to Haztrak

Thank you for your interest in contributing to haztrak, this short guide will
tell you everything you need to know before your first pull request.

- [I found a bug](#report-an-issue)
- [I have a feature request](#suggest-an-enhancement)
- [I'd like to work on an issue](#work-on-an-issue)

# How to Contribute

There are a variety of ways you can contribute to Haztrak, from reporting issues
to making code changes. Here are some of the ways you can get involved:

### Report an Issue

You can help us improve Haztrak by reporting any bugs
or issues you encounter. You can do this by opening an [issue on our GitHub
repository](https://github.com/USEPA/haztrak/issues).

### Suggest an Enhancement

If you have an idea for how we could improve Haztrak, please
share it with us! You can open an issue on our GitHub repository to suggest an
enhancement. Please be as detailed as possible in your suggestion.

If you have an idea It's best to open an issue, before starting work or
submitting a PR. we also welcome draft PRs.

### Work on an Issue

If you're looking to contribute code or documentation, here's the general process...

- Ask to be assigned an [Issues](https://github.com/USEPA/haztrak/issues).
- Fork this repo to your GitHub account.
- Clone your fork to your local workstation.

```shell
$ git clone git@github.com/<yourgithubusername>/haztrak.git
```

- Install the [pre-commit](https://pre-commit.com/) hooks
  - Once installed, will lint and format your changes to ensure we have a consistent style
  - See [pre-commit installation docs](https://pre-commit.com/#installation)

```shell
$ pre-commit install
```

- See our documentation on setting up a [local development environment](./local-development.md)
- If you are adding or changing haztrak's functionality, include new test(s) and
  make sure the test suite passes.
  - [See our documentation on Testing Haztrak](../design/testing.md)
- Submit a pull request to [USEPA/haztrak](https://github.com/USEPA/haztrak/pulls)

## Pull Request Guidelines

Before you submit a pull request, please make sure that your changes align with
our project goals and vision. Here are some guidelines to follow when submitting a pull request:

- Keep your pull requests small and focused.
- Make sure your code is well-documented and tested.
- Explain the reasoning behind your changes in the pull request description.
- Make sure your code follows Haztrak's coding style and conventions.
- Be open to feedback and willing to make changes to your code based on reviewer feedback.
