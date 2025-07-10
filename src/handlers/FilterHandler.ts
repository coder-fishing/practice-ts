// Filter handler for tag-based filtering
export class FilterHandler {
    private filterCallback: (tag: string) => Promise<any[]>;
    private triggerSuccess: (result: any) => void;
    private triggerError: (error: any) => void;
    private itemsPerPage: number;
    private sortField: string;
    private sortOrder: string;

    constructor(
        filterCallback: (tag: string) => Promise<any[]>,
        triggerSuccess: (result: any) => void,
        triggerError: (error: any) => void,
        itemsPerPage: number = 6,
        sortField: string = '',
        sortOrder: string = 'asc'
    ) {
        this.filterCallback = filterCallback;
        this.triggerSuccess = triggerSuccess;
        this.triggerError = triggerError;
        this.itemsPerPage = itemsPerPage;
        this.sortField = sortField;
        this.sortOrder = sortOrder;
    }

    /**
     * Handle tag filter with pagination support
     */
    public async handleTagFilterWithPagination(tag: string, page: number = 1): Promise<void> {
        try {
            console.log(`🏷️ Filtering by tag: "${tag}" (page ${page})`);
            
            // Get filtered results from callback
            const allResults = await this.filterCallback(tag);
            console.log(`✅ Found ${allResults.length} filtered results for tag: ${tag}`);
            
            // Apply pagination
            const totalItems = allResults.length;
            const totalPages = Math.ceil(totalItems / this.itemsPerPage);
            const startIndex = (page - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            const paginatedResults = allResults.slice(startIndex, endIndex);
            
            // Create result object
            const filterResult = {
                data: paginatedResults,
                paginationInfo: {
                    currentPage: page,
                    itemsPerPage: this.itemsPerPage,
                    totalItems: totalItems,
                    totalPages: totalPages,
                    start: startIndex + 1,
                    end: Math.min(endIndex, totalItems)
                },
                sortInfo: {
                    sortField: this.sortField,
                    sortOrder: this.sortOrder
                },
                isFilterResult: true,
                filterTag: tag,
                allFilterResults: allResults
            };

            // Trigger success callback to render table
            this.triggerSuccess(filterResult);
            
        } catch (error) {
            console.error('❌ Error during tag filter:', error);
            this.triggerError(error);
        }
    }

    /**
     * Handle tag filter (first page only)
     */
    public async handleTagFilter(tagText: string): Promise<void> {
        await this.handleTagFilterWithPagination(tagText, 1);
    }
}
