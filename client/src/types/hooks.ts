/**
 * Objects representing the necessary props used by Haztrak's pagination custom hook.
 */
export interface usePaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  maxVisiblePages?: number;
  useEllipsis?: boolean;
}
