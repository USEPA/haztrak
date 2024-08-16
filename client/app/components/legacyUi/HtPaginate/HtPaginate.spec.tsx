import { HtPaginate } from 'app/components/legacyUi';
import { cleanup, render, screen } from 'app/mocks';
import React from 'react';
import { afterEach, describe, expect, test } from 'vitest';

afterEach(() => {
  cleanup();
});

describe('HtPaginate', () => {
  const defaultCurrentPage = 1;
  const defaultTotalCount = 31;
  const defaultPageSize = 10;
  test('renders', () => {
    render(
      <>
        <HtPaginate
          onPageChange={() => undefined}
          currentPage={defaultCurrentPage}
          totalCount={defaultTotalCount}
          pageSize={defaultPageSize}
        />
      </>
    );
    for (let i = 1; i < Math.ceil(defaultTotalCount / defaultPageSize); i++) {
      expect(screen.getByText(`${i}`)).toBeInTheDocument();
    }
  });
  test('returns null when total is less than page size', () => {
    render(
      <>
        <HtPaginate
          onPageChange={() => undefined}
          currentPage={defaultCurrentPage}
          totalCount={defaultTotalCount}
          pageSize={defaultPageSize + defaultTotalCount}
        />
      </>
    );
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });
  test('Uses Ellipsis by default', async () => {
    render(
      <>
        <HtPaginate
          onPageChange={() => undefined}
          currentPage={defaultCurrentPage}
          totalCount={defaultTotalCount + 100}
          pageSize={defaultPageSize}
        />
      </>
    );
    const paginationRange = await screen.findAllByText('More');
    expect(paginationRange).toHaveLength(1);
  });
});
