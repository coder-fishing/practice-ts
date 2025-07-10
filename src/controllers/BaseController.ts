import type { PaginatedResponse } from "../services/BaseService";

export abstract class BaseController<T> {
    handleSearch() {
      throw new Error('Method not implemented.');
    }
    // Pagination state
    protected currentPage: number = 1;
    protected itemsPerPage: number = 6;
    protected totalItems: number = 0;
    protected totalPages: number = 0;

    // Sorting state
    protected sortField: string = '';
    protected sortOrder: 'asc' | 'desc' = 'asc';

    // UI state management
    protected loadingCallbacks: (() => void)[] = [];
    protected errorCallbacks: ((error: any) => void)[] = [];
    protected successCallbacks: ((data: any) => void)[] = [];

    /**
     * Abstract method để subclass implement service call
     */
    protected abstract getServicePaginated(page: number, limit: number): Promise<PaginatedResponse<T>>;

    /**
     * Initialize pagination with page size
     */
    public initializePagination(itemsPerPage: number = 6): void {
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
    }

    /**
     * Get current pagination state
     */
    public getPaginationState() {
        return {
            currentPage: this.currentPage,
            itemsPerPage: this.itemsPerPage,
            totalItems: this.totalItems,
            totalPages: this.totalPages,
        };
    }

    /**
     * Get current sort state
     */
    public getSortState() {
        return {
            sortField: this.sortField,
            sortOrder: this.sortOrder,
        };
    }

    /**
     * Set sort field and order
     */
    public setSorting(field: string, order: 'asc' | 'desc'): void {
        this.sortField = field;
        this.sortOrder = order;
        this.currentPage = 1; // Reset to first page when sorting
    }

    /**
     * Toggle sort order for a field
     */
    public toggleSort(field: string): void {
        if (this.sortField === field) {
            // Same field, toggle order
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            // New field, default to asc
            this.sortField = field;
            this.sortOrder = 'asc';
        }
        this.currentPage = 1; // Reset to first page when sorting
    }

    /**
     * Sort data locally (client-side sorting)
     */
    protected sortData(data: T[], field: string, order: 'asc' | 'desc'): T[] {
        if (!field) return data;

        return [...data].sort((a: any, b: any) => {
            let aValue = a[field];
            let bValue = b[field];

            // Handle null/undefined values
            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return order === 'asc' ? -1 : 1;
            if (bValue == null) return order === 'asc' ? 1 : -1;

            // Convert to string for comparison if needed
            if (typeof aValue === 'string') aValue = aValue.toLowerCase();
            if (typeof bValue === 'string') bValue = bValue.toLowerCase();

            // Compare values
            if (aValue < bValue) return order === 'asc' ? -1 : 1;
            if (aValue > bValue) return order === 'asc' ? 1 : -1;
            return 0;
        });
    }

    /**
     * Register UI callbacks
     */
    public registerUICallbacks(callbacks: {
        onLoading?: () => void;
        onError?: (error: any) => void;
        onSuccess?: (data: any) => void;
    }): void {
        if (callbacks.onLoading) this.loadingCallbacks.push(callbacks.onLoading);
        if (callbacks.onError) this.errorCallbacks.push(callbacks.onError);
        if (callbacks.onSuccess) this.successCallbacks.push(callbacks.onSuccess);
    }

    /**
     * Trigger loading state
     */
    protected triggerLoading(): void {
        this.loadingCallbacks.forEach(callback => callback());
    }

    /**
     * Trigger error state
     */
    protected triggerError(error: any): void {
        this.errorCallbacks.forEach(callback => callback(error));
    }

    /**
     * Trigger success state
     */
    protected triggerSuccess(data: any): void {
        this.successCallbacks.forEach(callback => callback(data));
    }

    /**
     * Load data for specific page and update pagination state
     */
    public async loadDataForPage(page: number): Promise<{
        data: T[];
        paginationInfo: {
            currentPage: number;
            itemsPerPage: number;
            totalItems: number;
            totalPages: number;
            start: number;
            end: number;
        };
        sortInfo: {
            sortField: string;
            sortOrder: 'asc' | 'desc';
        };
    }> {
        try {
            const result = await this.getServicePaginated(page, this.itemsPerPage);
            
            // Apply client-side sorting if sort field is set
            let sortedData = result.data;
            if (this.sortField) {
                sortedData = this.sortData(result.data, this.sortField, this.sortOrder);
            }
            
            // Update internal state
            this.currentPage = result.currentPage;
            this.totalItems = result.totalItems;
            this.totalPages = result.totalPages;

            const start = (this.currentPage - 1) * this.itemsPerPage + 1;
            const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);

            return {
                data: sortedData,
                paginationInfo: {
                    currentPage: this.currentPage,
                    itemsPerPage: this.itemsPerPage,
                    totalItems: this.totalItems,
                    totalPages: this.totalPages,
                    start,
                    end,
                },
                sortInfo: {
                    sortField: this.sortField,
                    sortOrder: this.sortOrder,
                },
            };
        } catch (error) {
            console.error('Error loading data for page:', error);
            throw error;
        }
    }

    /**
     * Load data for specific page with UI state management
     */
    public async loadDataForPageWithUI(page: number): Promise<void> {
        try {
            // Trigger loading state
            this.triggerLoading();

            const result = await this.loadDataForPage(page);
            
            // Trigger success state
            this.triggerSuccess(result);
        } catch (error) {
            // Trigger error state
            this.triggerError(error);
        }
    }

    /**
     * Generate page numbers for pagination display
     */
    public generatePageNumbers(maxVisible: number = 5): number[] {
        const pageNumbers = [];
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(this.totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        
        return pageNumbers;
    }

    /**
     * Check if can go to previous page
     */
    public canGoPrevious(): boolean {
        return this.currentPage > 1;
    }

    /**
     * Check if can go to next page
     */
    public canGoNext(): boolean {
        return this.currentPage < this.totalPages;
    }

    /**
     * Get previous page number
     */
    public getPreviousPage(): number {
        return Math.max(1, this.currentPage - 1);
    }

    /**
     * Get next page number
     */
    public getNextPage(): number {
        return Math.min(this.totalPages, this.currentPage + 1);
    }

    /**
     * Retry loading current page
     */
    public async retryLoadCurrentPage(): Promise<void> {
        await this.loadDataForPageWithUI(this.currentPage);
    }

    /**
     * Sort and reload current page
     */
    public async sortAndReload(field: string): Promise<void> {
        this.toggleSort(field);
        await this.loadDataForPageWithUI(this.currentPage);
    }

    /**
     * Handle tag filter - to be implemented by subclasses
     */
    public async handleTagFilter(): Promise<void> {
        const result = await this.loadDataForPage(1);
        this.triggerSuccess(result);
    }
}
