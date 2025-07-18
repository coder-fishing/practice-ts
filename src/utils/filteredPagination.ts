import { Pagination } from '~/view/components/pagination';
import { caretLeft } from '~/assets/icon';

/**
 * Enhanced pagination for filtered data with proper buttons
 */
export class FilteredPagination {
    private pageSize: number;
    private currentPage: number = 1;
    private filteredData: any[] = [];
    private tableRenderer: (data: any[], sortField?: string, sortOrder?: 'asc' | 'desc') => string;

    constructor(pageSize: number, tableRenderer: (data: any[], sortField?: string, sortOrder?: 'asc' | 'desc') => string) {
        this.pageSize = pageSize;
        this.tableRenderer = tableRenderer;
    }

    /**
     * Setup pagination for filtered data
     */
    public setupPagination(filteredData: any[]): void {
        this.filteredData = filteredData;
        this.currentPage = 1;
        
        const totalItems = filteredData.length;
        const totalPages = Math.ceil(totalItems / this.pageSize);
        
        
        
        // Update table with first page
        this.updateTableForPage(1);
        
        // Create pagination UI
        this.createPaginationUI(totalItems, totalPages);
    }

    /**
     * Update table for specific page
     */
    private updateTableForPage(page: number): void {
        const startIndex = (page - 1) * this.pageSize;
        const endIndex = Math.min(startIndex + this.pageSize, this.filteredData.length);
        const pageData = this.filteredData.slice(startIndex, endIndex);
        
        
        
        const tableContainer = document.querySelector('.product-table-container');
        if (tableContainer) {
            tableContainer.innerHTML = this.tableRenderer(pageData, '', 'asc');
        }
        
        this.currentPage = page;
    }

    /**
     * Create pagination UI
     */
    private createPaginationUI(totalItems: number, totalPages: number): void {
        const paginationContainer = document.querySelector('.pagination-container');
        if (!paginationContainer) return;
        
        // Clear existing content
        paginationContainer.innerHTML = '';
        
     
            
            
            // Create pagination component
            const paginationElement = Pagination({
                currentPage: this.currentPage,
                itemsPerPage: this.pageSize,
                totalItems: totalItems,
                totalPages: totalPages,
                caretLeft,
                onPageChange: (page: number) => {
                    
                    this.handlePageChange(page);
                }
            });
            
            paginationContainer.appendChild(paginationElement);
        
    }

    /**
     * Handle page change
     */
    private handlePageChange(page: number): void {
        
        
        // Show loading
        const tableContainer = document.querySelector('.product-table-container') as HTMLElement;
        if (tableContainer) {
            tableContainer.style.opacity = '0.5';
        }
        
        // Simulate loading delay
        setTimeout(() => {
            // Update table
            this.updateTableForPage(page);
            
            // Update pagination UI
            const totalItems = this.filteredData.length;
            const totalPages = Math.ceil(totalItems / this.pageSize);
            this.createPaginationUI(totalItems, totalPages);
            
            // Remove loading
            if (tableContainer) {
                tableContainer.style.opacity = '1';
            }
            
            
        }, 300);
    }

    /**
     * Get current page info
     */
    public getCurrentPageInfo(): { page: number; totalPages: number; totalItems: number } {
        const totalPages = Math.ceil(this.filteredData.length / this.pageSize);
        return {
            page: this.currentPage,
            totalPages,
            totalItems: this.filteredData.length
        };
    }
}

/**
 * Quick test function
 */
export function testEnhancedPagination() {
    
    
    // Mock data with more than 6 items to test pagination
    const mockData = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        name: `Test Product ${i + 1}`,
        price: 100 + i,
        status: 'Published'
    }));
    
    // Mock table renderer
    const mockRenderer = (data: any[]) => {
        return `
            <table class="product-table">
                <tbody>
                    ${data.map(item => `
                        <tr class="product-table__row">
                            <td>${item.name}</td>
                            <td>$${item.price}</td>
                            <td>${item.status}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    };
    
    // Create pagination instance
    const pagination = new FilteredPagination(6, mockRenderer);
    
    // Setup with mock data
    pagination.setupPagination(mockData);
    
    
    
}