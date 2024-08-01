import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {
  removeCredentials,
  selectAuthenticated,
  setCredentials,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { renderWithProviders, screen } from 'app/mocks';
import { afterEach, describe, expect, test, vi } from 'vitest';

const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

afterEach(() => {
  getItemSpy.mockClear();
  setItemSpy.mockClear();
  removeItemSpy.mockClear();
});

const TestComponent = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectAuthenticated);
  return (
    <div>
      <h1>Test</h1>
      <p>{isAuthenticated ? 'authenticated' : 'unauthenticated'}</p>
      <div>
        <button
          onClick={() => {
            dispatch(setCredentials({ token: 'mockToken' }));
          }}
        >
          Log in
        </button>
        <button
          onClick={() => {
            dispatch(removeCredentials());
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

describe('auth slice', () => {
  test('our localStorage mocks are working', () => {
    const value = 'test';
    localStorage.setItem('token', value);
    expect(setItemSpy).toHaveBeenCalled();
    const foo = localStorage.getItem('token');
    expect(setItemSpy).toHaveBeenCalled();
    expect(foo).toBe(value);
  });
  test('initial state is unauthenticated', () => {
    renderWithProviders(<TestComponent />);
    expect(screen.queryByText('unauthenticated')).toBeInTheDocument();
    expect(screen.queryByText('authenticated')).not.toBeInTheDocument();
  });
  test('setCredentials stores the token in local storage', async () => {
    renderWithProviders(<TestComponent />);
    await userEvent.click(screen.getByText('Log in'));
    expect(setItemSpy).toHaveBeenCalled();
  });
  test('selectAuthenticated is true after credentials are set', async () => {
    renderWithProviders(<TestComponent />);
    await userEvent.click(screen.getByText('Log in'));
    expect(screen.queryByText('authenticated')).toBeInTheDocument();
  });
  test('selectAuthenticated is false removeCredentials is dispatched', async () => {
    renderWithProviders(<TestComponent />, { preloadedState: { auth: { token: 'mockToken' } } });
    localStorage.setItem('token', 'mockToken');
    await userEvent.click(screen.getByText('Log out'));
    expect(screen.queryByText('unauthenticated')).toBeInTheDocument();
  });
  test('tokens are removed from localStorage on logout', async () => {
    renderWithProviders(<TestComponent />, { preloadedState: { auth: { token: 'mockToken' } } });
    localStorage.setItem('token', 'mockToken');
    await userEvent.click(screen.getByText('Log out'));
    expect(removeItemSpy).toHaveBeenCalled();
  });
});
