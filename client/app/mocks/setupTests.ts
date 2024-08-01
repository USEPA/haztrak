// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/matchers';
import { vi } from 'vitest';

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mocking the useAutoAnimate hook which causes error in the test environment
// https://github.com/formkit/auto-animate/issues/149#issuecomment-1782772600
vi.mock('@formkit/auto-animate/react', () => ({
  useAutoAnimate: () => [null],
}));
