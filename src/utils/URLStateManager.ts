export interface URLState {
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    filters?: Record<string, string | number | boolean>;
}

export class URLStateManager {
    private static instance: URLStateManager;

    public static getInstance(): URLStateManager {
        if (!URLStateManager.instance) {
            URLStateManager.instance = new URLStateManager();
        }
        return URLStateManager.instance;
    }

    public getCurrentState(): URLState {
        const params = new URLSearchParams(window.location.search);
        return {
            search: params.get('search') || undefined,
            sortBy: params.get('sortBy') || undefined,
            sortOrder: params.get('sortOrder') as 'asc' | 'desc' || undefined,
            page: params.has('page') ? parseInt(params.get('page') || '1', 10) : undefined,
            limit: params.has('limit') ? parseInt(params.get('limit') || '6', 6) : undefined,
            filters: this.parseFilters(params)
        }
    }

    private parseFilters(params: URLSearchParams): Record<string, string | number | boolean> | undefined {
        const filtersParam = params.get('filters');
        if (!filtersParam) return undefined;
        
        try {
            return JSON.parse(filtersParam);
        } catch (e) {
            return undefined;
        }
    }

    public updateState(newState: Partial<URLState>):void {
        const currentParams = new URLSearchParams(window.location.search);
        
        // Update each parameter
        Object.entries(newState).forEach(([key, value]) => {
            if ( value === undefined || value === null) {
                currentParams.delete(key);
            } else if (key === 'filters' && typeof value === 'object') {
                // Handle filters object specially
                currentParams.set(key, JSON.stringify(value));
            } else {
                currentParams.set(key, value.toString());
            }
        });

        // Set new URL
        const newUrl = `${window.location.pathname}?${currentParams.toString()}`;

        window.history.replaceState({}, '', newUrl);
    }

    // set parametter
    public setParam( key: string, value:string | number | boolean): void {
        this.updateState({ [key]: value });
    }

    // remove parameter
    public deleteParam(key: string): void {
        this.updateState({ [key]: undefined });
    }

    // Clear all parameters
    public clearAll(): void {
        window.history.replaceState({}, '', window.location.pathname);
    }

    // check if has filter/sort active
    public hasActiveFiltersOrSort(): boolean {
        const state = this.getCurrentState();
        return !!(state.search || state.sortBy || state.sortOrder || state.page || state.limit || state.filters);
    }

    // get main URL
    public getCleanUrl(): string {
        return window.location.pathname;
    }

    // Listen for URL change
    public onStateChange(callback: (state: URLState)=> void): void {
        window.addEventListener('popstate', () => {
            callback(this.getCurrentState());
        });
    }
}