## Server and Rest API

The REST API is the primary way users read and change data in the Haztrak
system. It is implemented using Python,
the [Django Framework](https://www.djangoproject.com/),
and [Django Rest Framework](https://www.django-rest-framework.org/).

The choice to use Python stemmed from a desire to use a language that the team
was already familiar with,
something that is easy to learn (regardless of whether Python is your primary
language, it's easy to read).
The choice to use Django was made because it is a mature, well-documented, and
widely used framework that provides a lot of functionality out of the box.

### Useful Links for Django architecture, the service layer, and more

in each Django app, you'll find a `service` package which encapsulates the domain logic.
Haztrak adopted this approach, for a couple reasons including:

1. Ease of testing
2. separation of concerns

- We subscribe to the belief that the view should be worried about just that, 'the representation'
- The model/active record approach leads to god classes that do too much

3. A good place to place multimodel logic.

[DjangoCon 2021 talk by Paul Wolf](https://www.youtube.com/watch?v=l5AtMQbAsAk&t=75s).
[Hack Soft Django Styleguide repo](https://github.com/HackSoftware/Django-Styleguide).
[Martin Fowler article on BoundedContext](https://www.martinfowler.com/bliki/BoundedContext.html).
[Article on service layer by Martin Fowler](https://martinfowler.com/eaaCatalog/serviceLayer.html).
[Against Service Layers in Django (reddit.com)](https://www.reddit.com/r/django/comments/fjqvwc/against_service_layers_in_django/?sort=top).

## Admin Site

The admin interface is an out-of-the-box feature of
the [Django framework](https://docs.djangoproject.com/en/stable/ref/contrib/admin/).
It can be found by appending `/admin` to the URL of the host and port of HTTP
server, for example `http://localhost/admin`

## In-memory Database

The in-memory data store serves a couple purposes,

- As a message broker for Haztrak's [task queue](./task-queue.md)
- A cache for the [http server](./http-server.md)

As a cache, the in-memory data store is utilized to increase performance by
allowing Haztrak to cut down on latency for recently used resources including
recent database queries, computed values, and external service calls. As a
message broker, the data store provides a reliable way for the back end service
to communicate which each other (e.g., launch background tasks).

The Haztrak project currently uses [Redis](https://redis.io/) as both the
message broker and in-memory data store.
