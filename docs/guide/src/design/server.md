## Server and Rest API

The REST API is the primary way users read and change data in the Haztrak system. It is implemented using Python,
the [Django Framework](https://www.djangoproject.com/),
and [Django Rest Framework](https://www.django-rest-framework.org/).

The choice to use Python stemmed from a desire to use a language that the team was already familiar with,
something that is easy to learn (regardless of whether Python is your primary language, it's easy to read).
The choice to use Django was made because it is a mature, well-documented, and widely used framework that provides a lot
of functionality out of the box.

Many Django developer have turned to what they call the 'service layer', which
usually encapsulated the use cases business logic. It's a contentious topic whether the policy/business logic should be
here or somewhere else, those in favor typically cite the principles discussed in Uncle Bob's classic book
[CLean Architecture](https://www.goodreads.com/en/book/show/18043011-clean-architecture).

### Useful Links for Django architecture, the service layer, and more

[DjangoCon 2021 talk by Paul Wolf](https://www.youtube.com/watch?v=l5AtMQbAsAk&t=75s).
[Hack Soft Django Styleguide repo](https://github.com/HackSoftware/Django-Styleguide).
[Martin Fowler article on BoundedContext](https://www.martinfowler.com/bliki/BoundedContext.html).
[Article on service layer by Martin Fowler](https://martinfowler.com/eaaCatalog/serviceLayer.html).
[Against Service Layers in Django (reddit.com)](https://www.reddit.com/r/django/comments/fjqvwc/against_service_layers_in_django/?sort=top).

## Admin Site

The Admin site provides a quick, model-centric interface where trusted
users can manage content. It's not intended to provide a process centric interface,
admin user's should not be, for example, signing manifests through the admin site.

The admin interface is an out-of-the-box feature of
the [Django framework](https://docs.djangoproject.com/en/4.1/ref/contrib/admin/).
It can be found by appending `/admin` to the URL of the host and port of HTTP server, for example
`http://localhost/admin`

## In-memory Database

The in-memory data store serves a couple purposes,

- As a message broker for Haztrak's [task queue](./task-queue.md)
- A cache for the [http server](./http-server.md)

As a cache, the in-memory data store is utilized to increase performance by allowing Haztrak to cut down on latency for
recently used resources including recent database queries, computed values, and external service calls. As a message
broker, the data store provides a reliable way for the back end service to communicate which each other (e.g., launch
background tasks).

The Haztrak project currently uses [Redis](https://redis.io/) as both the message broker and in-memory data store.
