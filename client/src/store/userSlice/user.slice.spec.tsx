import '@testing-library/jest-dom';
import { waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { useEffect, useState } from 'react';
import { useGetUserQuery, useUpdateUserMutation } from 'store';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { userApiMocks } from 'test-utils/mock';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';

const server = setupServer(...userApiMocks);
afterEach(() => {
  cleanup();
});
beforeAll(() => server.listen());
afterAll(() => server.close());

const UserQueryComponent = () => {
  const [fetchCount, setFetchCount] = useState(0);
  const { data, error, isLoading, isFetching } = useGetUserQuery();
  const [updateUser, results] = useUpdateUserMutation();

  useEffect(() => {
    if (isFetching) setFetchCount(fetchCount + 1);
  }, [isFetching]);

  if (isLoading || isFetching) {
    return <div>Loading</div>;
  }
  if (error) {
    return <div>Error</div>;
  }
  if (data) {
    return (
      <div>
        <h1>Data</h1>
        <p>username: {data.username}</p>
        <p>email: {data.email}</p>
        <p>fetchCount: {fetchCount}</p>
        <div>
          <button
            onClick={() => {
              updateUser({ ...data, username: 'updatedUserName', email: 'updatedEmail@gmail.com' });
            }}
          >
            Update User
          </button>
        </div>
      </div>
    );
  }
};

describe('userApi', () => {
  test('get user query', async () => {
    renderWithProviders(<UserQueryComponent />);
    await waitFor(() => screen.getByText('Data'));
    expect(screen.queryByText(/username:/i)).toBeInTheDocument();
  });
});
