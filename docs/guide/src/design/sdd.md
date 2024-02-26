# Source Design Document

This document's purpose is to outline Haztrak's system architecture and design. For more information on the project's specifications and requirements, see the [Software Requirements Specification](./srs.md).

- [Architecture Overview](#architecture-overview)
  - [Server](./server.md)
  - [Database](./db-design.md)
  - [Task Queue](./task-queue.md)
  - [Task Scheduler](./task-queue.md#periodic-tasks)
  - [Browser Client](./browser-client.md)
  - [Admin Site](#admin-site)
- [Testing](./testing.md)
- [Versioning](#versioning)

## Architecture Overview

Haztrak follows is consist of a number of containerized components. The components that are deployed separately but closely work together. The overall system would be classified as a monolithic architecture
however, certain components could be scaled independently (e.g., the number servers instances is separate from the front end), and newer versions of components could be deployed without affecting the entire system, given they do not introduce breaking changes. Nevertheless, the system is not designed to be categorized as microservices.

1. A [Server](./http-server.md) that exposes a RESTful API and a serv side rendered admin UI.
2. A [relational database](./db-design.md).
3. An in memory datastore
4. A [task queue](./task-queue.md)
5. A [task scheduler](./task-queue.md#periodic-tasks)
6. A client side rendered [user interface](./browser-client.md)

<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FFZmRRNHv7jvefDDY39KlKY%2FHaztrak%3Ftype%3Dwhiteboard%26node-id%3D402%253A818%26t%3D5Oo3kgbSqnCDRqF4-1" allowfullscreen></iframe>
