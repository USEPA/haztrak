import '@testing-library/jest-dom';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import React, { useState } from 'react';
import { renderWithProviders, screen, waitFor, cleanup } from 'test-utils';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { useProgressTracker } from 'hooks/useProgressTracker/useProgressTracker';
import userEvent from '@testing-library/user-event';
import { addTask, useAppDispatch } from 'store';

function TestComponent({ taskUUID }: { taskUUID: string }) {
  const dispatch = useAppDispatch();
  const [taskId, setTaskId] = useState<string | undefined>(undefined);
  // Use a short polling interval to speed up the test. The test will fail if the polling interval is too long.
  const { data, inProgress, error } = useProgressTracker({ taskId: taskId, pollingInterval: 300 });

  return (
    <>
      <p>{error ? 'error' : 'noError'}</p>
      {data ? (
        <>
          <p>{data.taskName}</p>
          <p>{data.status}</p>
        </>
      ) : (
        <p>noData</p>
      )}
      <p>{inProgress ? 'inProgress' : 'notInProgress'}</p>
      <button
        onClick={() => {
          dispatch(addTask({ taskId: taskUUID, taskName: 'mock name', status: 'PENDING' }));
          setTaskId(taskUUID);
        }}
      >
        setTaskId
      </button>
    </>
  );
}

const MOCK_TASK_ID = '10043946-9fcb-4ca2-82a4-f1ba2fa9f928';
const MOCK_BAD_TASK_ID = 'ac9e57dd-07b6-4568-bb42-99a2d6518f97';

/** mock Rest API*/
const API_BASE_URL = import.meta.env.VITE_HT_API_URL;
const handlers = [
  http.get(`${API_BASE_URL}/api/task/${MOCK_TASK_ID}`, function* f() {
    let requestCount = 0;
    while (requestCount < 3) {
      requestCount++;
      yield HttpResponse.json({ status: 'PENDING', taskId: MOCK_TASK_ID, taskName: 'mock name' });
    }
    yield HttpResponse.json({ status: 'SUCCESS', taskId: MOCK_TASK_ID, taskName: 'mock name' });
  }),
  http.get(`${API_BASE_URL}/api/task/${MOCK_BAD_TASK_ID}`, function* f() {
    let requestCount = 0;
    while (requestCount < 3) {
      requestCount++;
      yield HttpResponse.json({
        status: 'PENDING',
        taskId: MOCK_BAD_TASK_ID,
        taskName: 'mock name',
      });
    }
    yield HttpResponse.json({ status: 'FAILURE', taskId: MOCK_BAD_TASK_ID, taskName: 'mock name' });
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close()); // Disable API mocking after the tests are done.

afterEach(() => {
  cleanup();
});

describe('useProgressTracker', () => {
  test('inProgress is initially false', async () => {
    renderWithProviders(<TestComponent taskUUID={MOCK_TASK_ID} />);
    expect(screen.getByText(/notInProgress/i)).toBeInTheDocument();
  });
  test('inProgress is true when taskId is set', async () => {
    renderWithProviders(<TestComponent taskUUID={MOCK_TASK_ID} />);
    const button = screen.getByRole('button');
    expect(screen.getByText(/notInProgress/i)).toBeInTheDocument();
    await userEvent.click(button);
    expect(screen.getByText(/inProgress/i)).toBeInTheDocument();
  });
  test('data is undefined until task is complete', async () => {
    renderWithProviders(<TestComponent taskUUID={MOCK_TASK_ID} />);
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(screen.queryByText(/mock name/i)).not.toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/notInProgress/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/mock name/i)).toBeInTheDocument();
  });
});
