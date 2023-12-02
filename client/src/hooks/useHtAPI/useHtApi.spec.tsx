import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { useHtApi } from 'hooks';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { render, renderWithProviders, screen } from 'test-utils';
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

interface exampleData {
  foo: string;
  bar: string;
}

interface exampleProps {
  url: string;
}

function TestComponent({ url }: exampleProps) {
  const [data, loading, error] = useHtApi<exampleData>(url);
  if (error) {
    return (
      <>
        <p>{error.message}</p>
      </>
    );
  } else {
    return <>{loading ? <p>loading</p> : <p>{data?.foo}</p>}</>;
  }
}

/**
 * mock Rest API
 */
const API_BASE_URL = import.meta.env.VITE_HT_API_URL;
export const testURL = [
  http.get(`${API_BASE_URL}/api/test/url`, (info) => {
    return HttpResponse.json(
      {
        foo: 'foo',
        bar: 'bar',
      },
      { status: 200 }
    );
  }),
  http.get(`${API_BASE_URL}/api/bad/url`, (info) => {
    return HttpResponse.json(
      {
        error: {
          message: 'resource not found',
        },
      },
      { status: 404 }
    );
  }),
];

const server = setupServer(...testURL);

beforeAll(() => server.listen()); // setup mock http server
afterEach(() => {
  server.resetHandlers();
  cleanup();
  vi.resetAllMocks();
});
afterAll(() => server.close()); // Disable API mocking after the tests are done.

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe('useHtAPI', () => {
  test('initially sets loading to true', () => {
    render(<TestComponent url="test/url" />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  test('sets data to the response body', async () => {
    renderWithProviders(<TestComponent url="test/url" />);
    expect(await screen.findByText(/foo/i)).toBeInTheDocument();
  });
  test('sets the error for bad requests', async () => {
    renderWithProviders(<TestComponent url="bad/url" />);
    expect(await screen.findByText(/404/i)).toBeInTheDocument();
  });
});
