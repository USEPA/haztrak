import { cleanup, fireEvent } from '@testing-library/react';
import React from 'react';
import { render, screen } from 'test';
import useTitle from './index';

const originalPageTitle = 'originalPageTitle';
const newPageTitle = 'newPageTitle';

interface TestCompProps {
  prevailOnUnmount?: boolean;
  excludeAppend?: boolean;
}

function TestComponent({ prevailOnUnmount, excludeAppend }: TestCompProps) {
  const [pagetitle, setPageTitle] = useTitle(originalPageTitle, prevailOnUnmount, excludeAppend);
  return (
    <>
      <p>Hello!</p>
      <button onClick={() => setPageTitle(newPageTitle)}>Change Title</button>
      <p>{pagetitle ? pagetitle : 'undefined'}</p>
    </>
  );
}

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

describe('useTitle', () => {
  it('sets the initial page title, plus " | Haztrak"', () => {
    render(<TestComponent />);
    expect(document.title).toContain(originalPageTitle);
  });
  it('It can be used to changes the title', () => {
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
