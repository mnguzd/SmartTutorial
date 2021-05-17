export interface IFilter {
    path: string;
    value: string;
    operation: string;
}
export interface IRequestFilter {
    logicalOperator: 0 | 1;
    filters: IFilter[];
}
export interface IPaginatedRequest {
    pageIndex: number;
    pageSize: number;
    columnNameForSorting?: string;
    sortDirection?: "Asc" | "Desc";
    requestFilters?: IRequestFilter;
}
export interface IPaginatedResult<TEntity> {
    pageIndex: number;
    pageSize: number;
    total: number;
    items: TEntity[];
}