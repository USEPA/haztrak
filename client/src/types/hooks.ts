export interface usePaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  maxVisiblePages?: number;
  useEllipsis?: boolean;
}
