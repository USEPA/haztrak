# Haztrak Client Architecture

## Application Overview

The browser client is a single page application (SPA) that uses the [React library and ecosystem](https://react.dev/) to client side render the user interface. It is responsible for guiding the
user during the creation, editing, and signing of electronic manifests.

## Application Configuration

The project was originally bootstrapped with `Create React App` but was transitioned to use the `Vite`
build tool. For more information on Vite, see the [Vite documentation](https://vitejs.dev/). The configuration is found in `./client/vite.config.ts`.

The following tools have been configured to aid development:

### ESLint

The project uses ESLint to lint the codebase and prevent developers from making common/easy to fix mistakes and enforce consistency. For more information on ESLint, see the [ESLint documentation](https://eslint.org/).

### TypeScript

While ESLint is great for catching common little mistakes related to JavaScript, TypeScript is a superset of JavaScript that adds type checking. It's a great tool for catching more complex mistakes and preventing them from making it into production. For more information on TypeScript, see the [TypeScript documentation](https://www.typescriptlang.org/). TypeScript is configured in `./client/tsconfig.json`.

### Prettier

Prettier is a tool for formatting. If enforces a consistent style across the entire codebase and amongst multiple developers, thereby making the codebase more readable and maintainable. For more information on Prettier, see the [Prettier documentation](https://prettier.io/).

## Style Guide

### Clean Code

A classic book on writing clean code is [Clean Code: A Handbook of Agile Software Craftsmanship](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882). It's a great read and highly recommended.

### Naming Conventions

Haztrak recommends reading this [naming convention guide](https://github.com/kettanaito/naming-cheatsheet) hosted on github that (conveniently) uses javascript.

In addition, the project uses the following naming conventions for various items:

#### Selectors

Selectors are functions that take the state as an argument and return some data from the state.
They are used to encapsulate the state shape and allow us to change the state shape without having
to change all the places where we access the state.

We use two naming conventions for selectors:

1. `<stateField>Selector`

#### React Components

Constructors that return a React component should be named with PascalCase. (e.g., `MyComponent`). In addition, the file they are located in should also be named with PascalCase (e.g., `MyComponent.tsx`).

#### React features

Do differentiate between react components and features, we use lowercase directory name. These directories often do not export a named constant that is identical to the directory name.

```Typescript
import { ManifestDetails as Component } from './ManifestDetails';

export { Component };
```

which will automatically be lazy loaded by the React router, which helps with code splitting and keeps are bundle sizes small.

## Project Structure

See the [source roadmap](./source-roadmap.md) for a high level overview of the project structure.

## State Management

### Application State

The project employs `Redux` and `Redux toolkit` as a global state management library. The store is the single source of truth for the client application and stores information relevant to all/most/many subcomponents in the application. For more information on redux, see the [redux documentation](https://redux.js.org/).

### Component State

The project uses the `useState` and `useReducer` React hooks to manage component state. For more information on hooks, see the [react documentation](https://reactjs.org/docs/hooks-intro.html). This type of state is local to a component and can be passed down to child components via props or context.

### Form State

The project embraces use of uncontrolled form inputs where possible. As such, the project uses the `react-hook-form` library to manage form state. For more information on `react-hook-form`, see the [react-hook-form documentation](https://react-hook-form.com/).

Since the manifest is a relatively large and complex schema, we do need to use controlled components when necessary. For example, the hazardous waste generator's state, which is used in other parts of the manifest form to decide what state waste codes are available for selection. This state is controlled in the ManifestForm component and passed down to the child components that need it via props (e.g., the generator form and the waste line forms).

The `react-hook-form` library facilitates the mechanism we use to add one-to-many relationships via the
`useFieldArray` hook. This allows us to add/edit/delete multiple waste lines and transporters to a manifest.

The forms are also integrated with a schema validation library, currently zod. This allows us to validate the form data before submitting it to the server. For more information on zod, see the [zod documentation](https://zod.dev).

### URL state

The project uses the `react-router` library to manage URL state. For more information on `react-router`, see the [react-router documentation](https://reactrouter.com/). Parameters are passed to components via the URL and are accessible via the `useParams` hook which allows users to share URLs with other users and bookmark URLs for later use.

The complete URL tree can be viewed in the `routes.tsx` file in the root of the client directory.

## Testing

This project uses `vitest` as the test runner as it integrates its configs seamlessly with the `vite` build tool and exposes a `Jest` compatible API (which is generally a standard in the javascript ecosystem). For more information on `vitest`, see the [vitest documentation](https://vitest.dev/).

### Tooling

As previously mentioned the project uses `vitest`. In addition, for assertions, the project uses the `react-testing-library` library. For more information on `react-testing-library`, see the [react-testing-library documentation](https://testing-library.com/docs/react-testing-library/intro/).
We also use `msw` to mock API requests to ensure that test can be run offline with predictable results. For more information on `msw`, see the [msw documentation](https://mswjs.io/).

### Unit Tests

Unit test represent the bulk of our tests. These test a single unit or component and ensure that it behaves as expected. Unit tests are located in the same directory as the component they are testing and are named with the `.spec.tsx` extension.

### Integration Tests

Integration test look similar to unit test, but they test multiple components simultaneously and ensure they interact as expected. Like unit tests, integration tests are located in the same directory as the component they are testing and are named with the `.spec.tsx` extension.

With integration test, we primarily focus on testing behavior of components to ensure the user interface is behaving as expected. We do not test the implementation details of the components, such as the internal state of the component.
