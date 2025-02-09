import { AxiosResponse } from 'axios';
import { describe, expect, it, vi } from 'vitest';
import { returnOnSuccess } from '~/services/APIs/htApi';

vi.mock('react-router', () => ({
  redirect: vi.fn(),
}));

const createMockResponse = (status: number): AxiosResponse => ({
  // @ts-expect-error - ok for test
  config: {},
  data: undefined,
  headers: {},
  status,
  statusText: '',
});

describe('htApi response interceptor', () => {
  it('returns same response', async () => {
    const response = createMockResponse(200);
    const returnedResponse = returnOnSuccess(response);
    expect(returnedResponse).toBe(response);
  });
});
