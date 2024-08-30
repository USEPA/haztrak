import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '~/mocks';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form';

describe('Form components', () => {
  const errorProps = {
    useFormProps: {
      errors: {
        username: {
          type: 'manual',
          message: 'Username is required',
        },
      },
    },
  };
  it('renders FormField with all subcomponents', () => {
    renderWithProviders(
      <FormField
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <input placeholder="shadcn" {...field} />
            </FormControl>
            <FormDescription>This is your public display name.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );

    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('shadcn')).toBeInTheDocument();
    expect(screen.getByText('This is your public display name.')).toBeInTheDocument();
  });

  it('displays error message in FormMessage when there is an error', () => {
    // form.setError('username', { type: 'manual', message: 'Username is required' });

    renderWithProviders(
      <FormField
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <input placeholder="shadcn" {...field} />
            </FormControl>
            <FormDescription>This is your public display name.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />,
      { ...errorProps }
    );

    expect(screen.getByText('Username is required')).toBeInTheDocument();
  });

  it('does not render FormMessage when there is no error', () => {
    renderWithProviders(
      <FormField
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <input placeholder="shadcn" {...field} />
            </FormControl>
            <FormDescription>This is your public display name.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
    expect(screen.queryByText('Username is required')).not.toBeInTheDocument();
  });

  it('sets aria-invalid attribute on FormControl when there is an error', () => {
    // form.setError('username', { type: 'manual', message: 'Username is required' });

    renderWithProviders(
      <FormField
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <input placeholder="shadcn" {...field} />
            </FormControl>
            <FormDescription>This is your public display name.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />,
      { ...errorProps }
    );

    expect(screen.getByPlaceholderText('shadcn')).toHaveAttribute('aria-invalid', 'true');
  });
});
