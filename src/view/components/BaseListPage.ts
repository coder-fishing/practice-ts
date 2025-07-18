import { breadCrumbs } from '~/view/components/breadCrumb';
import { groupButton } from '~/view/components/groupButton';
import { TagFilter } from '~/view/components/tagFilter';
import { searchBar } from '~/view/components/searchBar';
import { Pagination } from '~/view/components/pagination';
import { caretLeft } from '~/assets/icon';
import { hideOverlayLoading, showOverlayLoading } from '~/view/components/loading';
import type { BaseController } from '~/controllers/BaseController';
import ProductController from '../../controllers/ProductController';

interface BaseListPageConfig<T> {
  controller: BaseController<T>;
  breadcrumbConfig: any;
  buttonConfig: any;
  tableRenderer: (data: T[], sortField?: string, sortOrder?: 'asc' | 'desc') => string;
  tagFilter?: {
    filters: any[];
    currentFilter: any;
  };
  className?: string;
  title?: string;
  pageSize?: number;
}

export class BaseListPage<T> {
  private controller: BaseController<T>;
  private breadcrumbConfig: any;
  private buttonConfig: any;
  private tableRenderer: (data: T[], sortField?: string, sortOrder?: 'asc' | 'desc') => string;
  private tagFilter?: { filters: any[]; currentFilter: any };
  private className: string;
  private title: string;
  private pageSize: number;
  private currentSearchQuery: string = ''; // Track current search query
  private currentFilterTag: string = ''; // Track current filter tag

  constructor(config: BaseListPageConfig<T>) {
    this.controller = config.controller;
    this.breadcrumbConfig = config.breadcrumbConfig;
    this.buttonConfig = config.buttonConfig;
    this.tableRenderer = config.tableRenderer;
    this.tagFilter = config.tagFilter;
    this.className = config.className || 'product-list';
    this.title = config.title || 'List';
    this.pageSize = config.pageSize || 6;
  }

  // Setup UI callbacks for controller
  private setupControllerCallbacks(): void {
    this.controller.registerUICallbacks({
      onLoading: () => {
        const tableContainer = document.querySelector('.product-table-container');
        if (tableContainer) {
          showOverlayLoading();
        }
      },
      onError: (error: any) => {
        console.error('Error loading data:', error);
        const tableContainer = document.querySelector('.product-table-container');
        if (tableContainer) {
          tableContainer.innerHTML = `
              <div class="no-data-message">
                <p >No data available.</p>
              </div>
          `;
        }
      },
      onSuccess: (result: any) => {
        // Update table
        const tableContainer = document.querySelector('.product-table-container');
        if (tableContainer) {
          if (result.data.length==0) {
            this.hideNavigation();
            tableContainer.innerHTML = `
              <div class="no-data-message">
                <p >No data available.</p>
              </div>
            `;
            hideOverlayLoading();
            return;
          }
          // If data is available, show navigation
          this.showNavigation();
          tableContainer.innerHTML = this.tableRenderer(
            result.data, 
            result.sortInfo?.sortField || '', 
            result.sortInfo?.sortOrder || 'asc'
          );
        }
        hideOverlayLoading();
        
        // Check if this is a search result
        if (result.isSearchResult) {
          // Track current search query
          this.currentSearchQuery = result.searchQuery || '';
          this.currentFilterTag = ''; // Clear filter tag
          // Show search info and pagination
          this.showSearchResults();
          this.updatePaginationDisplay(result.paginationInfo);
          
        } 
        // Check if this is a filter result (only for ProductController)
        else if (result.isFilterResult) {
          // Track current filter tag
          this.currentFilterTag = result.filterTag || '';
          this.currentSearchQuery = ''; // Clear search query
          // Show filter info and pagination
          this.showFilterResults();
          this.updatePaginationDisplay(result.paginationInfo);
          
        } 
        else {
          // Clear both search and filter
          this.currentSearchQuery = '';
          this.currentFilterTag = '';
          // Show pagination and hide search/filter info
          this.hideSearchResults();
          this.hideFilterResults();
          this.showPagination();
          if (result.paginationInfo) {
            this.updatePaginationDisplay(result.paginationInfo);
          }
        }
        
        // Setup sort event listeners
        this.setupSortEventListeners();
        
        // Setup retry button event listener
        // this.setupRetryEventListener();
      }
    });
  }

  // Function to update only the table and pagination
  private updateTableAndPagination = async (page: number): Promise<void> => {
    // Check if we're in search mode
    if (this.currentSearchQuery) {
      // Use search pagination
      const controller = this.controller as any;
      if (controller.searchProductsWithPagination) {
        await controller.searchProductsWithPagination(this.currentSearchQuery, page);
      } else if (controller.searchCategoriesWithPagination) {
        await controller.searchCategoriesWithPagination(this.currentSearchQuery, page);
      } else {
        console.warn('Controller does not support search pagination');
        await this.controller.loadDataForPageWithUI(page);
      }
    } 
    // Check if we're in filter mode (only for ProductController)
    else if (this.currentFilterTag) {
      // Use filter pagination for ProductController only
      const productController = this.controller as any;
      if (productController instanceof ProductController && productController.handleTagFilterWithPagination) {
        await productController.handleTagFilterWithPagination(this.currentFilterTag, page);
      } else {
        console.warn('Filter pagination only supported for ProductController');
        await this.controller.loadDataForPageWithUI(page);
      }
    } 
    else {
      // Use regular pagination
      await this.controller.loadDataForPageWithUI(page);
    }
  };

  // Function to update pagination display and add event listeners
  private updatePaginationDisplay(paginationInfo: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    start: number;
    end: number;
  }): void {
    const paginationContainer = document.querySelector('.pagination-container');
    if (paginationContainer) {
      // Clear existing content
      paginationContainer.innerHTML = '';
      
      // Create pagination component
      const paginationElement = Pagination({
        currentPage: paginationInfo.currentPage,
        itemsPerPage: paginationInfo.itemsPerPage,
        totalItems: paginationInfo.totalItems,
        totalPages: paginationInfo.totalPages,
        caretLeft,
        onPageChange: async (page: number) => {
          await this.updateTableAndPagination(page);
        }
      });
      
      // Append to container
      paginationContainer.appendChild(paginationElement);
    }
  }

  // Setup global retry function
  private setupGlobalRetry(): void {
    (window as any).retryLoadData = () => {
      this.controller.retryLoadCurrentPage();
    };
  }

  // Setup sort event listeners
  private setupSortEventListeners(): void {
    const sortableHeaders = document.querySelectorAll('.sortable-header[data-field]');
    sortableHeaders.forEach(header => {
      header.addEventListener('click', async (e) => {
        const field = (e.currentTarget as HTMLElement).dataset.field;
        if (field) {
          await this.controller.sortAndReload(field);
        }
      });
    });
  }

  // Setup tag filter event listeners (only for ProductController)
  private setupTagFilterListeners(): void {
    if (!this.tagFilter) return;

    const tagItems = document.querySelectorAll('.tag-add-searchbar__tag--item');
    tagItems.forEach(item => {
      item.addEventListener('click', async (e) => {
        const tagElement = e.currentTarget as HTMLElement;
        const tagText = tagElement.querySelector('.tag-add-searchbar__tag--item-element')?.textContent || '';
        
        console.log('🏷️ BaseListPage tag clicked:', tagText);
        console.log('🏷️ BaseListPage controller type:', this.controller.constructor.name);
        console.log('🏷️ BaseListPage controller instanceof ProductController:', this.controller instanceof ProductController);
        
        // Remove active class from all tags
        tagItems.forEach(tag => tag.classList.remove('item-active'));
        
        // Add active class to clicked tag
        tagElement.classList.add('item-active');
        
        // Handle tag filter for ProductController specifically
        const productController = this.controller as any;
        if (productController instanceof ProductController && productController.handleTagFilterWithPagination) {
          console.log('🏷️ BaseListPage calling handleTagFilterWithPagination');
          await productController.handleTagFilterWithPagination(tagText, 1);
        } else {
          console.warn('Tag filter only supported for ProductController');
        }
      });
    });
  }

  // Show search results info
  private showSearchResults(): void {
    this.hideSearchResults();
    // this.hidePagination();
  }

  // Hide search results info
  private hideSearchResults(): void {
    const searchInfo = document.querySelector('.search-results-info');
    if (searchInfo) {
      searchInfo.remove();
    }
  }


  // Show pagination
  private showPagination(): void {
    const paginationContainer = document.querySelector('.pagination-container') as HTMLElement;
    if (paginationContainer) {
      paginationContainer.style.display = 'block';
    }
  }

  // Show filter results info (only for ProductController)
  private showFilterResults(): void {
    this.hideFilterResults();   
  }

  // Hide filter results info
  private hideFilterResults(): void {
    const filterInfo = document.querySelector('.filter-results-info');
    if (filterInfo) {
      filterInfo.remove();
    }
  }

  private hideNavigation(): void {
    const pagin = document.querySelector('.pagination-container') as HTMLElement;
      if (pagin) {
        pagin.style.display = 'none'; 
      }
  }

  private showNavigation(): void {
    const pagin = document.querySelector('.pagination-container') as HTMLElement;
    if (pagin) {
      pagin.style.display = 'block'; 
    }
  }

  // Setup global clear search function
  private setupGlobalClearSearch(): void {
    (window as any).clearSearch = () => {
      // Clear search input
      const searchInput = document.querySelector('.search-bar input') as HTMLInputElement;
      if (searchInput) {
        searchInput.value = '';
      }
      
      // Trigger search with empty query to reset
      this.controller.handleSearch();
    };

    // Setup global clear filter function (only for ProductController)
    (window as any).clearFilter = () => {
      
      this.currentFilterTag = '';
      
      // Check if this is ProductController
      const productController = this.controller as any;
      if (!(productController instanceof ProductController)) {
        console.warn('Clear filter only supported for ProductController');
        return;
      }
      
      // Click "All" tag to reset filter or reload data
      const allTags = document.querySelectorAll('.tag-add-searchbar__tag--item');
      let allTagFound = false;
      
      allTags.forEach(tag => {
        const tagText = tag.querySelector('.tag-add-searchbar__tag--item-element')?.textContent;
        if (tagText === 'All' || tagText === 'All Status') {
          // Remove active class from all tags
          allTags.forEach(t => t.classList.remove('item-active'));
          // Add active class to "All" tag
          tag.classList.add('item-active');
          allTagFound = true;
        }
      });
      
      // Fallback: reload page 1 if no "All" tag found
      if (!allTagFound) {
        this.updateTableAndPagination(1);
      } else {
        // Trigger filter with "All" to reset
        if (productController.handleTagFilterWithPagination) {
          productController.handleTagFilterWithPagination('All', 1);
        }
      }
    };
  }

  // Generate the HTML content
  private generateHTML(): string {
    const tagFilterHtml = this.tagFilter ? 
      TagFilter(
        this.tagFilter.filters.map(filter => filter.name || filter),
        this.tagFilter.currentFilter?.name || this.tagFilter.currentFilter
      ) : '';

    const searchSection = this.tagFilter ? `
      <div class="tag-add-searchbar">
        <div class="tag-filter-container">
          ${tagFilterHtml}
        </div>
        <div class="tag-add-searchbar__search">
          ${searchBar("Search").outerHTML}
        </div>
      </div>
    ` : `
      <div class="tag-add-searchbar">
        <div class="tag-add-searchbar-none"></div>
        <div class="tag-add-searchbar__search">
          ${searchBar("Search").outerHTML}
        </div>
      </div>
    `;

    return `
      <div class="product-title">
        <div class="product-title-left">
          <p class="product-title-left__name">${this.title}</p>
          ${breadCrumbs(
            this.breadcrumbConfig.items,
            this.breadcrumbConfig.icon
          )}
        </div>   
        ${groupButton(this.buttonConfig)} 
      </div>
      ${searchSection}
      <div class="product-table-container">
     
      </div>
      <div class="pagination-container"></div>
    `;
  }

  // Main render method
  public async render(): Promise<HTMLElement> {
    const container = document.createElement('div');
    container.className = this.className;

    // Initialize pagination
    this.controller.initializePagination(this.pageSize);

    // Setup callbacks and global functions
    this.setupControllerCallbacks();
    this.setupGlobalRetry();
    this.setupGlobalClearSearch(); // This includes both clearSearch and clearFilter functions

    // Set HTML content
    container.innerHTML = this.generateHTML();

    // Load initial data after DOM is ready
    setTimeout(() => {
      // Setup sort event listeners
      this.setupSortEventListeners();
      
      // Setup tag filter listeners
      this.setupTagFilterListeners();

      /* 
      Check if URL has parameters to avoid loading default data
      */
      // Check if URL has parameters to avoid loading default data
      // const urlParams = new URLSearchParams(window.location.search);
      // const hasUrlParams = urlParams.has('page') || urlParams.has('sortBy') || urlParams.has('sortOrder') || urlParams.has('search');
      
      // Only load initial data if no URL parameters exist
      // if (!hasUrlParams) {
      //   this.updateTableAndPagination(1);
      // }
    }, 0);

    return container;
  }
}
