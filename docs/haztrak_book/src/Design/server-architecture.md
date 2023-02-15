# Server Architecture

## Introduction

This chapter documents the architecture (or lack thereof) of our http server.

This project is intended to be a proof of concept application, and our time constraints
are large. At the certain point, when we started to look at integrating with RCRAInfo,
we started to fight the django framework or looking for a place to put that business logic that Django doesn't really
document.

Many Django developer have turned to what they call the 'service layer', which
usually encapsulated the use cases business logic. It's a contentious topic whether the policy/business logic should be
here or somewhere else, those in favor typically cite the principles discussed in Uncle Bob's classic book
[CLean Architecture](https://www.goodreads.com/en/book/show/18043011-clean-architecture).
We've adopted, as of Feb. 2023, a hybrid approach. One, it avoids unnecessary work, and lets Django do what django does
best. The downside is we do not have a uniform implementation.

## References

[DjangoCon 2021 talk by Paul Wolf](https://www.youtube.com/watch?v=l5AtMQbAsAk&t=75s).
[Hack Soft Django Styleguide repo](https://github.com/HackSoftware/Django-Styleguide).
[Martin Fowler article on BoundedContext](https://www.martinfowler.com/bliki/BoundedContext.html).
[Article on service layer by Martin Fowler](https://martinfowler.com/eaaCatalog/serviceLayer.html).
[Against Service Layers in Django (reddit.com)](https://www.reddit.com/r/django/comments/fjqvwc/against_service_layers_in_django/?sort=top).
