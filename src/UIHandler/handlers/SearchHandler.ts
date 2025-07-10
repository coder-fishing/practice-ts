// Search handler for managing search functionality across controllers
export class SearchHandler {
    private debounceDelay: number = 300;
    private searchTimeout: number | null = null;
    private onSearch: (query: string, page: number) => Promise<any>;
    private onClear: () => void;
    
    constructor(
        onSearch: (query: string, page: number) => Promise<any>,
        onClear: () => void
    ) {
        this.onSearch = onSearch;
        this.onClear = onClear;
    }

    /**
     * Setup search functionality for multiple selectors
     */
    public setupSearch(): void {
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
                foundInputs += searchInputs.length;
                
                searchInputs.forEach((searchInput, index) => {
                    console.log(`✅ Setting up search listener for input ${index + 1}`);
                    
                    searchInput.addEventListener('input', this.handleSearchInput.bind(this));
                    searchInput.addEventListener('focus', () => {
                        console.log('🔍 Search input focused');
                    });
                });
            }
        });
        
        console.log(`📊 Found ${foundInputs} search inputs`);
    }

    /**
     * Handle search input with debouncing
     */
    private async handleSearchInput(event: Event): Promise<void> {
        const query = (event.target as HTMLInputElement).value.trim();
        
        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        // Set new timeout for debounced search
        this.searchTimeout = window.setTimeout(async () => {
            if (query.length >= 2) {
                try {
                    await this.onSearch(query, 1);
                } catch (error) {
                    console.error('❌ Error during search:', error);
                }
            } else if (query.length === 0) {
                this.onClear();
            }
        }, this.debounceDelay);
    }

    /**
     * Initialize search with automatic setup and retry
     */
    public initialize(): void {
        // Setup search immediately
        this.setupSearch();
        
        // Setup again after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.setupSearch(), 100);
            });
        }
        
        // Watch for dynamically added search inputs
        this.setupMutationObserver();
    }

    /**
     * Setup mutation observer for dynamically added search inputs
     */
    private setupMutationObserver(): void {
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
                        setTimeout(() => this.setupSearch(), 500);
                    }
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Cleanup search handlers
     */
    public cleanup(): void {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = null;
        }
    }
}
