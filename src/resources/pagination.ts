export interface Pagination {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

/** Envelope returned by list endpoints that use `{ data, pagination }` (templates, smart links). */
export interface PaginatedResponse<T> {
    data: T[];
    pagination: Pagination;
}

export interface PageParams {
    page?: number;
    size?: number;
}
