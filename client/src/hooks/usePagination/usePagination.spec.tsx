import { act, cleanup, fireEvent, waitFor } from '@testing-library/react';
import usePagination from 'hooks/usePagination/index';
import React, { useState } from 'react';
import { render, screen } from 'test';

interface TestUsePagProps {
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  siblingCount?: number;
  useEllipsis?: boolean;
  maxVisiblePages?: number;
}

const defaultTotalCount = 101;
const defaultCurrentPage = 1;
const defaultPageSize = 10;
const newTotalCount = 151;

function TestPaginationHook({
  totalCount = defaultTotalCount,
  currentPage = defaultCurrentPage,
  pageSize = defaultPageSize,
  siblingCount,
  useEllipsis,
  maxVisiblePages,
}: TestUsePagProps) {
  const [myTotalCount, setMyTotalCount] = useState(totalCount);
  const paginationRange = usePagination({
    totalCount: myTotalCount,
    currentPage,
    pageSize,
    siblingCount,
    useEllipsis,
    maxVisiblePages,
  });
  if (!paginationRange) return null;
  return (
    <>
      <ul data-testid="totalCount">
        {paginationRange.map((item, index) => (
          <li key={`${item}${index}`} data-testid={'item'}>
            {item}
          </li>
        ))}
      </ul>
      <button onClick={() => setMyTotalCount(newTotalCount)}>Click Me</button>
    </>
  );
}

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

describe('usePagination', () => {
  test('defaults to returning a simple array', async () => {
    render(<TestPaginationHook />);
    const paginationRange = await screen.findAllByTestId('item');
    expect(paginationRange).toHaveLength(Math.ceil(defaultTotalCount / defaultPageSize));
  });
  test('Returns single ellipsis when on page 1', async () => {
    render(<TestPaginationHook useEllipsis={true} />);
    const paginationRange = await screen.findAllByText('...');
    expect(paginationRange).toHaveLength(1);
  });
  test('Returns 2 ellipsis when current page is 3 + 2(siblingCount) from start and end', async () => {
    render(<TestPaginationHook useEllipsis={true} currentPage={5} />);
    const paginationRange = await screen.findAllByText('...');
    expect(paginationRange).toHaveLength(2);
  });
  test('Returns 2 siblings on each side of active', async () => {
    const siblingCount = 2;
    render(<TestPaginationHook useEllipsis={true} currentPage={5} siblingCount={siblingCount} />);
    const paginationRange = await screen.findAllByTestId('item');
    const numActivePages = 1; // The current page
    const numSiblings = siblingCount * 2; // for each side of active
    const numEllipsis = 2; // a '...' for each side of active
    const numEndPages = 2; // one for each side
    // Total number of <li> elements with correct test ID we expect
    const numExpectedElements = numActivePages + numSiblings + numEllipsis + numEndPages;
    expect(paginationRange).toHaveLength(numExpectedElements);
  });
  test('updates when number of elements changes', async () => {
    render(<TestPaginationHook />);
    const paginationRange = await screen.findAllByTestId('item');
    expect(paginationRange).toHaveLength(Math.ceil(defaultTotalCount / defaultPageSize));
    fireEvent.click(screen.getByText('Click Me'));
    const newPagination = await waitFor(() => screen.findAllByTestId('item'));
    expect(newPagination).toHaveLength(Math.ceil(newTotalCount / defaultPageSize));
  });
});
