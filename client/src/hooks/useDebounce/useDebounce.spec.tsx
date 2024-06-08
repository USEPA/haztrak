import '@testing-library/jest-dom';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';
import { beforeAll, afterAll, afterEach, describe, expect, it, vi } from 'vitest';

describe('useDebounce hook', () => {
  beforeAll(() => {
    vi.useFakeTimers(); // Use fake timers
  });

  afterAll(() => {
    vi.clearAllTimers(); // Clear all timers after tests
  });

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should update the debounced value after the specified delay', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    // Update the value
    rerender({ value: 'updated', delay: 500 });

    // Before the delay, the debounced value should still be 'initial'
    expect(result.current).toBe('initial');

    // Fast forward time by 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // After the delay, the debounced value should be 'updated'
    expect(result.current).toBe('updated');
  });

  it('should reset the timer when value changes within the delay period', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    // Update the value multiple times within the delay period
    rerender({ value: 'updated1', delay: 500 });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    rerender({ value: 'updated2', delay: 500 });

    // Fast forward time by the remaining 200ms
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // The debounced value should still be 'initial' because the timer was reset
    expect(result.current).toBe('initial');

    // Fast forward time by 300ms
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // After the full delay, the debounced value should be 'updated2'
    expect(result.current).toBe('updated2');
  });

  afterEach(() => {
    vi.clearAllTimers(); // Clear all timers after each test
  });
});
