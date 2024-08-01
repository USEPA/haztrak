import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SiteType } from '~/components/Manifest/manifestSchema';
import { useHandlerSearchConfig } from '~/hooks/manifest/useOpenHandlerSearch/useHandlerSearchConfig';
import React from 'react';
import { renderWithProviders, screen } from 'app/mocks';
import { afterEach, describe, expect, it } from 'vitest';

const TestChildComponent = () => {
  const [configs] = useHandlerSearchConfig();
  return (
    <>
      <p>child open: {configs?.open ? 'yes' : 'no'}</p>
      <p>child siteType: {configs?.siteType ?? 'undefined'}</p>
    </>
  );
};

const TestComponent = ({ siteType }: { siteType?: SiteType; open?: boolean }) => {
  const [configs, setConfigs] = useHandlerSearchConfig();
  return (
    <>
      <p>open: {configs?.open ? 'yes' : 'no'}</p>
      <button onClick={() => setConfigs({ open: true, siteType: siteType ?? 'generator' })}>
        search
      </button>
      <TestChildComponent />
    </>
  );
};

afterEach(() => cleanup());

describe('useHandlerSearchConfig', () => {
  it('handler search model is closed by default', () => {
    renderWithProviders(<TestComponent />);
    expect(screen.getByText(/^open: no/i)).toBeInTheDocument();
  });
  it('shares open state with other components', async () => {
    renderWithProviders(<TestComponent />);
    expect(screen.getByText(/^open: no/i)).toBeInTheDocument();
    expect(screen.getByText(/^child open: no/i)).toBeInTheDocument();
    await userEvent.click(screen.getByText(/^search$/i));
    expect(screen.getByText(/^open: yes/i)).toBeInTheDocument();
    expect(screen.getByText(/^child open: yes/i)).toBeInTheDocument();
  });
});
