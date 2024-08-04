import { describe, expect, afterEach, it } from 'vitest';
import { cleanup, fireEvent } from '@testing-library/react';
import React from 'react';
import { render, screen } from 'app/mocks';
import { useTitle } from '~/hooks';

const originalPageTitle = 'originalPageTitle';
const newPageTitle = 'newPageTitle';

interface TestCompProps {
  prevailOnUnmount?: boolean;
  excludeAppend?: boolean;
}

function TestComponent({ prevailOnUnmount, excludeAppend }: TestCompProps) {
  const [pageTitle, setPageTitle] = useTitle(originalPageTitle, prevailOnUnmount, excludeAppend);
  return (
    <>
      <p>Hello!</p>
      <button onClick={() => setPageTitle(newPageTitle)}>Change Title</button>
      <p>{pageTitle ? pageTitle : 'undefined'}</p>
    </>
  );
}

afterEach(() => {
  cleanup();
});

describe('useTitle', () => {
  it('sets the initial page title, plus " | Haztrak"', () => {
    render(<TestComponent />);
    expect(document.title).toContain(originalPageTitle);
  });
  it('changes the page title', () => {
    render(<TestComponent />);
    fireEvent.click(screen.getByText(/Change Title/i));
    expect(document.title).toContain(newPageTitle);
  });
  it('The state is updated when the title is changed', () => {
    render(<TestComponent />);
    expect(screen.getByText(/undefined/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Change Title/i));
    expect(screen.getByText(newPageTitle)).toBeInTheDocument();
  });
  it('appends Global site title to each page title by default', () => {
    render(<TestComponent />);
    expect(document.title).toContain('Haztrak');
  });
  it('does not appends Global site title if specified', () => {
    render(<TestComponent excludeAppend={true} />);
    expect(document.title).not.toContain('Haztrak');
  });
});
