import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "@lib/toast";

import { PaginatedResponse } from "@types";

interface UseListingProps<T, F, R extends PaginatedResponse<T>, P = Record<string, unknown>> {
  /** The API function to call. It should accept an object of QueryParams. */
  fetchFn: (params: P) => Promise<R>;
  /** Initial filter values. */
  initialFilters: F;
  /** Optional initial data to skip first fetch. */
  initialData?: T[];
  /** Optional initial total records count if initialData is provided. */
  initialTotalItems?: number;
  /** Initial number of items per page. */
  initialPageSize?: number;
  /** Initial page index (default 1). */
  initialPage?: number;
  /** Custom success message for manual refresh. */
  toastMessage?: string;
  /** Optional callback on successful fetch. */
  onSuccess?: (response: R) => void;
  /** Optional callback on failed fetch. */
  onError?: (error: unknown) => void;
  /** Optional function to transform filters before API call. (e.g. "all" to undefined) */
  filterMapping?: (filters: F) => Record<string, unknown>;
}

export function useListing<
  T,
  F extends object,
  R extends PaginatedResponse<T> = PaginatedResponse<T>,
  P = Record<string, unknown>,
>({
  fetchFn,
  initialFilters,
  initialData = [],
  initialTotalItems = 0,
  initialPageSize = 10,
  initialPage = 1,
  toastMessage = "Data refreshed successfully",
  onSuccess,
  onError,
  filterMapping,
}: UseListingProps<T, F, R, P>) {
  const [data, setData] = useState<T[]>(initialData || []);
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(initialTotalItems || 0);
  const [totalPages, setTotalPages] = useState(
    initialTotalItems ? Math.ceil(initialTotalItems / initialPageSize) : 1,
  );
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [filters, setFilters] = useState<F>(initialFilters);

  // Mount guard and stabilization refs
  const isFirstMount = useRef(true);
  const isFetchingRef = useRef(false);
  const fetchFnRef = useRef(fetchFn);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const filterMappingRef = useRef(filterMapping);
  const toastMessageRef = useRef(toastMessage);

  // Track previous params to prevent redundant calls
  const prevParamsRef = useRef<string>("");

  // Update refs when props change without triggering dependencies
  useEffect(() => {
    fetchFnRef.current = fetchFn;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
    filterMappingRef.current = filterMapping;
    toastMessageRef.current = toastMessage;
  }, [fetchFn, onSuccess, onError, filterMapping, toastMessage]);

  const fetchItems = useCallback(
    async (isRefresh = false) => {
      // Create current params string for comparison
      const currentParamsStr = JSON.stringify({
        currentPage,
        pageSize,
        filters,
        initialDataLength: initialData.length,
      });

      // Skip if already fetching OR if params haven't changed (unless manual refresh)
      if (
        !isRefresh &&
        (isFetchingRef.current || currentParamsStr === prevParamsRef.current)
      ) {
        return;
      }

      // Skip if we have initial data on first mount (unless it's a manual refresh)
      if (!isRefresh && isFirstMount.current && initialData.length > 0) {
        isFirstMount.current = false;
        prevParamsRef.current = currentParamsStr;
        setIsLoading(false);
        return;
      }

      isFetchingRef.current = true;
      setIsLoading(true);
      try {
        const activeFilters = filterMappingRef.current
          ? filterMappingRef.current(filters)
          : (filters as unknown as Record<string, unknown>);

        const params: Record<string, unknown> = {
          page: currentPage,
          limit: pageSize,
          ...activeFilters,
        };

        const response = await fetchFnRef.current(params as unknown as P);

        const fetchedData = response.data || [];
        const pagination = response.pagination;

        setData(fetchedData);
        setTotalItems(pagination?.total_records || 0);
        setTotalPages(pagination?.total_pages || 1);

        if (onSuccessRef.current) onSuccessRef.current(response);

        if (isRefresh) {
          toast.success(toastMessageRef.current, { title: "Data Updated" });
        }

        // Update previous params ref after successful fetch
        prevParamsRef.current = currentParamsStr;
      } catch (error) {
        console.error("useListing fetch error:", error);
        if (onErrorRef.current) onErrorRef.current(error);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
        isFirstMount.current = false;
      }
    },
    [currentPage, pageSize, filters, initialData.length],
  );

  // Auto-fetch data on state change
  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const handleFilterChange = useCallback((newFilters: Partial<F>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);

  const handleSingleFilterChange = useCallback((key: string, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value } as F));
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setCurrentPage(1);
  }, [initialFilters]);

  // Derived state for active filter count
  const activeFiltersCount = Object.keys(filters).filter((key) => {
    const val = filters[key as keyof F];
    if (val === "all" || val === "" || val === undefined || val === null) {
      return false;
    }
    return true;
  }).length;

  return {
    data,
    isLoading,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    filters,
    activeFiltersCount,
    fetchItems,
    refresh: async () => {
      await fetchItems(true);
    },
    handleFilterChange,
    handleSingleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    resetFilters,
    setPage: setCurrentPage,
    setPageSize,
    setFilters,
  };
}
