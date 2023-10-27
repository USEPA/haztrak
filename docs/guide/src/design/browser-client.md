# Browser Client Architecture

The browser client is a single page application (SPA) that uses the [React library and ecosystem](https://react.dev/) to client side render the user interface. It

## Redux Store

The redux store is the single source of truth for the client application. It contains
state that's central to the operation of the application. For more information on redux,
see the [redux documentation](https://redux.js.org/).

### Naming Conventions

For consist naming conventions, we've adopted the following:

#### Selectors

Selectors are functions that take the state as an argument and return some data from the state.
They are used to encapsulate the state shape and allow us to change the state shape without having
to change all the places where we access the state.

We use two naming conventions for selectors:

1. `select<StateField>` for selectors that return a single field from the state.
2. `<stateField>Selector` for selectors that return a more complex data structure. Values are
   memoized using the RTK's createSelector function.

##### Examples

```typescript
// Selects the `user` field from the state.
import { useAppSelector } from 'store/hooks';
import { selectUserName } from 'store/userSlice';

const userName = useAppSelector(selectUserName);
```
