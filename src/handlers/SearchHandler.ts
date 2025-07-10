// Search handler for both Category and Product controllers
export class SearchHandler {
    private debounceDelay = 300;
    private searchTimeout: number | null = null;
    private searchCallback: (query: string, page: number, limit: number) => Promise<any[]>;
    private triggerSuccess: (result: any) => void;
    private triggerError: (error: any) => void;
    private itemsPerPage: number;

    constructor(
        searchCallback: (query: string, page: number, limit: number) => Promise<any[]>,
        triggerSuccess: (result: any) => void,
        triggerError: (error: any) => void,
        itemsPerPage: number = 6
    ) {
        this.searchCallback = searchCallback;
        this.triggerSuccess = triggerSuccess;
        this.triggerError = triggerError;
        this.itemsPerPage = itemsPerPage;
    }

    /**
     * Initialize search functionality
     */
    public initialize(): void {
        console.log('🚀 Initializing search functionality...');
        this.setupSearchListeners();
        this.watchForDynamicInputs();
    }

    /**
     * Setup search event listeners
     */
    private setupSearchListeners(): void {
        const searchSelectors = [
            '.search-input',
            '.search-bar_input', 
            '.search-bar-input',
            'input[placeholder*="Search"]',
            'input[placeholder*="search"]',
            'input[type="search"]',
            '[data-search="true"]'
        ];
        
        let foundInputs = 0;
        
        searchSelectors.forEach(selector => {
            const searchInputs = document.querySelectorAll<HTMLInputElement>(selector);
            
            if (searchInputs.length > 0) {
                console.log(`🔍 Found ${searchInputs.length} search input(s) with selector: ${selector}`);
                foundInputs += searchInputs.length;
                
                searchInputs.forEach((searchInput, index) => {
                    this.attachSearchListener(searchInput, index);
                });
            }
        });

        if (foundInputs === 0) {
            console.warn('⚠️ No search inputs found');
        }
    }

    /**
     * Attach search listener to input
     */
    private attachSearchListener(searchInput: HTMLInputElement, index: number): void {
        console.log(`✅ Setting up search listener for input ${index + 1}:`, {
            class: searchInput.className,
            placeholder: searchInput.placeholder,
            id: searchInput.id
        });
        
        // Add debounced search listener
        searchInput.addEventListener('input', async (event) => {
            const query = (event.target as HTMLInputElement).value.trim();
            await this.handleSearchInput(query);
        });
        
        // Add focus event for debugging
        searchInput.addEventListener('focus', () => {
            console.log(`🎯 Search input ${index + 1} focused`);
        });
    }

    /**
     * Handle search input with debouncing
     */
    private async handleSearchInput(query: string): Promise<void> {
        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        // Set new timeout for debounced search
        this.searchTimeout = window.setTimeout(async () => {
            if (query.length >= 2) {
                await this.performSearch(query);
            } else if (query.length === 0) {
                console.log('🧹 Search cleared');
                this.handleSearchClear();
            }
        }, this.debounceDelay);
    }

    /**
     * Perform actual search
     */
    private async performSearch(query: string): Promise<void> {
        try {
            console.log(`🔍 Searching for: "${query}"`);
            const allResults = await this.searchCallback(query, 1, 1000);
            console.log(`✅ Search completed: found ${allResults.length} items`);
            
            this.buildSearchResult(allResults, query);
            
        } catch (error) {
            console.error('❌ Error during search:', error);
            this.triggerError(error);
        }
    }

    /**
     * Build search result object
     */
    private buildSearchResult(allResults: any[], query: string): void {
        const totalItems = allResults.length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const paginatedResults = allResults.slice(0, this.itemsPerPage);
        
        const searchResult = {
            data: paginatedResults,
            paginationInfo: {
                currentPage: 1,
                itemsPerPage: this.itemsPerPage,
                totalItems: totalItems,
                totalPages: totalPages,
                start: 1,
                end: Math.min(this.itemsPerPage, totalItems)
            },
            sortInfo: {
                sortField: '',
                sortOrder: 'asc' as const
            },
            isSearchResult: true,
            searchQuery: query,
            allSearchResults: allResults
        };
        
        this.triggerSuccess(searchResult);
    }

    /**
     * Handle search clear
     */
    private handleSearchClear(): void {
        // This should be handled by the controller
        // Override this method in subclasses if needed
    }

    /**
     * Watch for dynamically added search inputs
     */
    private watchForDynamicInputs(): void {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const addedNodes = Array.from(mutation.addedNodes);
                    const hasSearchInputs = addedNodes.some(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const element = node as Element;
                            return element.matches('input') || 
                                   element.querySelector('input') ||
                                   element.matches('.search-input') ||
                                   element.querySelector('.search-input');
                        }
                        return false;
                    });
                    
                    if (hasSearchInputs) {
                        console.log('🔄 New search inputs detected, setting up handlers...');
                        setTimeout(() => this.setupSearchListeners(), 500);
                    }
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('✅ Search initialization completed with MutationObserver');
    }

    /**
     * Search with pagination support
     */
    public async searchWithPagination(query: string, page: number = 1): Promise<void> {
        try {
            console.log(`🔍 Searching for: "${query}" (page ${page})`);
            
            const allResults = await this.searchCallback(query, 1, 1000);
            console.log(`✅ Found ${allResults.length} total search results`);
            
            const totalItems = allResults.length;
            const totalPages = Math.ceil(totalItems / this.itemsPerPage);
            const startIndex = (page - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            const paginatedResults = allResults.slice(startIndex, endIndex);
            
            const searchResult = {
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
                    sortField: '',
                    sortOrder: 'asc' as const
                },
                isSearchResult: true,
                searchQuery: query,
                allSearchResults: allResults
            };

            this.triggerSuccess(searchResult);
            
        } catch (error) {
            console.error('❌ Error during paginated search:', error);
            this.triggerError(error);
        }
    }
}
