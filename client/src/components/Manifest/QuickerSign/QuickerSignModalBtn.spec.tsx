import '@testing-library/jest-dom';
import { QuickerSignModalBtn } from 'components/Manifest/QuickerSign/index';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { createMockMTNHandler } from 'test-utils/fixtures';

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

describe('QuickerSignModalBtn', () => {
  test('renders', () => {
    const handler = createMockMTNHandler();
    renderWithProviders(
      <QuickerSignModalBtn
        siteType={'Generator'}
        mtnHandler={handler}
        handleClick={() => console.log('hello')}
      />
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  test('is disabled when already signed', () => {
    const signed_handler = createMockMTNHandler({
      signed: true,
    });
    renderWithProviders(
      <QuickerSignModalBtn
        siteType={'Generator'}
        mtnHandler={signed_handler}
        handleClick={() => console.log('hello')}
      />
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });
  test('is not disabled when not signed and user is API user', () => {
    // A handler that has not signed the manifest to be rendered
    const unsigned_handler = createMockMTNHandler({
      signed: false,
      paperSignatureInfo: undefined,
      electronicSignaturesInfo: undefined,
    });
    renderWithProviders(
      <QuickerSignModalBtn
        siteType={'Generator'}
        mtnHandler={unsigned_handler}
        handleClick={() => console.log('hello')}
      />,
      {
        // Redux store state with an API user is required for this button to be active
        preloadedState: {
          rcraProfile: {
            user: 'username',
            phoneNumber: '1231231234',
            apiUser: true,
          },
        },
      }
    );
    expect(screen.getByRole('button')).not.toBeDisabled();
  });
  test('is disabled when API user but already signed', () => {
    // A handler that has not signed the manifest to be rendered
    const unsigned_handler = createMockMTNHandler({
      signed: true,
    });
    renderWithProviders(
      <QuickerSignModalBtn
        siteType={'Generator'}
        mtnHandler={unsigned_handler}
        handleClick={() => console.log('hello')}
      />,
      {
        // Redux store state with an API user is required for this button to be active
        preloadedState: {
          rcraProfile: {
            user: 'username',
            phoneNumber: '1231231234',
            apiUser: false,
          },
        },
      }
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
