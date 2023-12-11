import React from 'react';
import '@testing-library/jest-dom';
import { HandlerSearchForm } from './HandlerSearchForm';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { afterEach, describe, expect, test } from 'vitest';

afterEach(() => {
  cleanup();
});

describe('HandlerSearchForm', () => {
  test('renders with basic information inputs', () => {
    renderWithProviders(
      <HandlerSearchForm handleClose={() => undefined} handlerType="generator" />
    );
    expect(screen.getByText(/EPA ID/i)).toBeInTheDocument();
  });
});
