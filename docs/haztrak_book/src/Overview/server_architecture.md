# Server Architecture

## Introduction

This chapter documents the architecture (or lack thereof) of our http server.

This project is intended to be a proof of concept application, and our time constraints
are large. At the certain point, when we started to look at integrating with RCRAInfo,
we started to fight the django framework. Django does a few things really well,
when your views closely align with your ORM model, Django (and the Rest Framework)
is fantastic at taking those model instance, and displaying them to the use.

When we start talking about more complex business logic, logic that doesn't
necessarily correspond to a model, or a view, the question arises. Where do we put it?

many Django developer have turned to what they call the 'service layer', which
is a way to implement a lot of the principles discussed in Uncle Bob's book
[CLean Architecture](https://www.goodreads.com/en/book/show/18043011-clean-architecture)

## Service Layer (research)

This documents our research into the idea of implementing a
[service layer](https://martinfowler.com/eaaCatalog/serviceLayer.html) for Haztrak.

## Background

The common Django line of reasoning says that
logic related to a model should be implemented as a custom [model method](https://docs.djangoproject.com/en/4.1/topics/db/models/#model-methods),
Inter-model logic can be placed in a custom [model Manager](https://docs.djangoproject.com/en/4.1/topics/db/managers/),
and things like calls to external APIs and long-running tasks can be offloaded
to a task queue, like [Celery](https://docs.celeryq.dev/en/stable/userguide/tasks.html).

The alternative is all business logic should live in a separate service layer,
an idea that's grown in popularity lately. Essentially, Django models are
responsible for just the data layer, Django Views and Celery Tasks are just
used as an interface to access the application's business logic, these items
remain separate from each other, and we have a distinct separation of responsibility.

Rado has a good talk on YouTube about this design pattern [here](https://www.youtube.com/watch?v=yG3ZdxBb1oo).

The downside is, of course, we have an entirely new layer we need to implement,
that's not really a part of the Django framework, it requires discipline
(and team coordination) to do right, could easily turn into spaghetti code,
would require some significant overhead, and we cannot make use of the
higher level abstractions in that Django and [DRF](https://www.django-rest-framework.org/)
make available to use like [ModelViewSets](https://www.django-rest-framework.org/api-guide/viewsets/).

Haztrak has a lot of business logic related to using the RCRAInfo RESTful APIs.
When we started writing tasks to interface with RCRAInfo, this logic originally
went into our celery tasks. This was hacky at best, and it was easy to see
that we were going to end up duplicating logic that should be elsewhere (or
possibly used elsewhere).

## Investigation Result

*TLDR* we are not pursuing a full-featured service layer architecture at this time.
We may implement a phased approach when necessary and keep Django's direct
Views --> Model for more simple requirements.

We are going to refactor the RCRAInfo related
functionality into a 'service' which will wrap around/inherit from the
[emanifest python package](https://pypi.org/project/emanifest/) and the use thereof. This service can then
be called from the Celery tasks as needed, but the logic will not directly
reside in the celery tasks themselves.

While I see the merits of the service layer approach, it does not seem to
take advantage of the Django ecosystem (not a good fit for Django architecture).

This decision was reached in part due to the limited scope of Haztrak,
the limited time available to the Haztrak developers, and the nature of the
service layer that requires us to essentially re-invent the wheel.

## References

[DjangoCon 2021 talk by Paul Wolf](https://www.youtube.com/watch?v=l5AtMQbAsAk&t=75s)
[Hack Soft Django Styleguide repo](https://github.com/HackSoftware/Django-Styleguide)
[Martin Fowler article on BoundedContext](https://www.martinfowler.com/bliki/BoundedContext.html)
[Against Service Layers in Django (reddit.com)](https://www.reddit.com/r/django/comments/fjqvwc/against_service_layers_in_django/?sort=top)



