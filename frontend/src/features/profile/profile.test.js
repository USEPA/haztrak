import { cleanup } from '@testing-library/react';

// if you're unfamiliar with testing React apps using the Jest test runner,
// we do not need to import functions like 'test' and 'describe' because Jest
// makes them globally available in the Jest environment

// Mount/render typically used for integration testing, shallow is used for unit testing

afterEach(cleanup);

describe('Profile component test', () => {
  test('multiply by 2', () => {
    expect(1 + 1).toBe(2);
  });
});
