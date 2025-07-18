import ProductService from '../services/ProductService';
import { BaseController } from './BaseController';
import type { Product } from '../types/product.type';
import ProductUIHandler from '../UIHandler/ProductUIHandler';
import uploadToCloudinary from '~/utils/uploadToCloudinary';
import { hideOverlayLoading, showOverlayLoading } from '~/view/components/loading';
import { router } from '~/router/Router';
import { createToast } from '~/utils/toast';
import { SearchHandler } from '../handlers/SearchHandler';
import { TableInteractionHandler } from '../handlers/TableInteractionHandler';
import { FilterHandler } from '../handlers/FilterHandler';
import { ValidationService } from '../utils/ValidationProductForm';
import { URLStateManager } from "../utils/URLStateManager";
import { DropdownEventHandler } from "../utils/DropdownEventHandler";

export class ProductController extends BaseController<Product> {
    private static instance: ProductController;
    private productService: ProductService;
    uiHandler: ProductUIHandler;
    private searchHandler: SearchHandler;
    private tableHandler: TableInteractionHandler;
    private filterHandler: FilterHandler;
    private urlManager: URLStateManager;
    private dropdownHandler: DropdownEventHandler;
    private productOrigin: Product | null = null;

    constructor() {
        super();
        this.productService = new ProductService();
        this.uiHandler = new ProductUIHandler();
        this.urlManager = URLStateManager.getInstance();
        this.dropdownHandler = DropdownEventHandler.getInstance();
        
        // Initialize handlers
        this.searchHandler = new SearchHandler(
            this.searchProducts.bind(this),
            this.triggerSuccess.bind(this),
            this.triggerError.bind(this),
            this.itemsPerPage
        );
        
        this.tableHandler = new TableInteractionHandler(
            router,
            this.deleteProduct.bind(this),
            'product'
        );
        
        this.filterHandler = new FilterHandler(
            this.getTagFilter.bind(this),
            this.triggerSuccess.bind(this),
            this.triggerError.bind(this),
            this.itemsPerPage,
            this.sortField,
            this.sortOrder
        );
    }

    public static getInstance(): ProductController {
        if (!ProductController.instance) {
            ProductController.instance = new ProductController();
        }
        return ProductController.instance;
    }

    /**
     * Implement abstract method từ BaseController
     */
    protected async getServicePaginated(page: number, limit: number) {
        return this.productService.getProductsPaginated(page, limit) || this.productService.searchProducts('', page, limit);
    }

    /**
     * Get all products
     */
    public async getAllProducts() {
        return this.productService.getAllProducts();
    }

    // src/controllers/ProductController.ts
    public async getTagFilter(tag: string): Promise<Product[]> {
        const products = await this.productService.getAllProducts();
        console.log('🏷️ getTagFilter - tag:', tag, 'total products:', products.length);
        
        if (tag === 'Published') {
            const filtered = products.filter(product => product.status?.toLowerCase() === 'published');
            console.log('🏷️ getTagFilter - Published filtered count:', filtered.length);
            return filtered;
        } else if (tag === 'Draft') {
            const filtered = products.filter(product => product.status?.toLowerCase() === 'draft');
            console.log('🏷️ getTagFilter - Draft filtered count:', filtered.length);
            return filtered;
        } else if (tag === 'Low Stock') {
            const filtered = products.filter(product => product.status?.toLowerCase() === 'low stock');
            console.log('🏷️ getTagFilter - Low Stock filtered count:', filtered.length);
            return filtered;
        }
        
        console.log('🏷️ getTagFilter - returning all products for tag:', tag);
        return products;
    }

    /**
     * Alias methods for backward compatibility
     */
    public async loadProductsForPage(page: number) {
        return this.loadDataForPage(page);
    }

    public async loadProductsForPageWithUI(page: number) {
        return this.loadDataForPageWithUI(page);
    }

    /**
     * Get product by ID
     */
    public async getProductById(id: number) {
        return this.productService.getProductById(id);
    }

    /**
     * Create new product
     */
    public async createProduct(productData: any) {
        return this.productService.createProduct(productData);
    }

    /**
     * Update an existing product
     */
    public async updateProduct(id: number, productData: Product): Promise<Product> {
        return this.productService.updateProduct(id, productData);
    }

    /**
     * Delete a product
     */
    public async deleteProduct(id: number): Promise<void> {
        await this.productService.deleteProduct(id);
        await this.loadDataForPageWithUI(this.currentPage || 1);
    }

    /**
     * Search products by query
     */
    public async searchProducts(query: string, page: number, limit: number): Promise<Product[]> {
        return this.productService.searchProducts(query, page, limit);
    }

    /**
     * Initialize search functionality
     */
    public initializeSearch(): void {
        this.searchHandler.initialize();
        
        // Override search handler to update URL
        const searchInputs = document.querySelectorAll<HTMLInputElement>('.search-input, .search-bar_input, input[type="search"]');
        let searchTimeout: number | null = null;
        
        searchInputs.forEach((searchInput) => {
            searchInput.addEventListener('input', async (event) => {
                const query = (event.target as HTMLInputElement).value.trim();
                
                if (searchTimeout) clearTimeout(searchTimeout);
                
                searchTimeout = window.setTimeout(async () => {
                    if (query.length >= 2) {
                        await this.searchProductsWithPagination(query, 1);
                    } else if (query.length === 0) {
                        // Clear search from URL
                        this.urlManager.updateState({
                            search: undefined,
                            page: 1
                        });
                        this.loadDataForPageWithUI(1);
                    }
                }, 300);
            });
        });
    }

    /**
     * Search with pagination
     */
    public async searchProductsWithPagination(query: string, page: number = 1): Promise<void> {
        // Update URL with search parameters
        this.urlManager.updateState({
            search: query || undefined,
            page: page,
            sortBy: this.sortField || undefined,
            sortOrder: this.sortOrder || undefined
        });

        return this.searchHandler.searchWithPagination(query, page);
    }

    /**
     * Setup table event listeners
     */
    public setupTableEventListeners(): void {
        this.tableHandler.setupTableInteractions();
    }

    /**
     * Handle tag filter
     */
    public async handleTagFilter(): Promise<void> {
        // This method signature must match the base class
        // For tag-specific filtering, use handleTagFilterWithPagination instead
    }

    /**
     * Handle tag filter with specific tag text
     */
    public async handleTagFilterByText(tagText: string): Promise<void> {
        return this.filterHandler.handleTagFilter(tagText);
    }

    /**
     * Handle tag filter with pagination
     */
    public async handleTagFilterWithPagination(tag: string, page: number = 1): Promise<void> {
        console.log('🏷️ ProductController handleTagFilterWithPagination - tag:', tag, 'page:', page, 'sortField:', this.sortField, 'sortOrder:', this.sortOrder);
        
        // Update URL with filter parameters
        this.urlManager.updateState({
            filters: tag === 'All' ? undefined : { tag: tag },
            page: page,
            sortBy: this.sortField || undefined,
            sortOrder: this.sortOrder || undefined
        });

        // Get filtered data
        const filteredData = await this.getTagFilter(tag);
        console.log('🏷️ ProductController handleTagFilterWithPagination - filteredData count:', filteredData.length);
        
        // Apply sorting if set
        let sortedData = filteredData;
        if (this.sortField) {
            sortedData = this.applySorting(filteredData, this.sortField, this.sortOrder);
            console.log('🏷️ ProductController handleTagFilterWithPagination - after sorting, sortedData count:', sortedData.length);
        }
        
        // Apply pagination
        const pageSize = this.itemsPerPage || 6;
        const totalItems = sortedData.length;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedResults = sortedData.slice(startIndex, endIndex);
        console.log('🏷️ ProductController handleTagFilterWithPagination - paginatedResults count:', paginatedResults.length);
        
        const filterResult = {
            data: paginatedResults,
            paginationInfo: {
                currentPage: page,
                itemsPerPage: pageSize,
                totalItems: totalItems,
                totalPages: Math.ceil(totalItems / pageSize),
                start: startIndex + 1,
                end: Math.min(startIndex + pageSize, totalItems)
            },
            isFilterResult: true,
            filterTag: tag,
            sortInfo: {
                sortField: this.sortField,
                sortOrder: this.sortOrder
            }
        };

        this.triggerSuccess(filterResult);
    }

    /**
     * Apply sorting to data array
     */
    private applySorting(data: Product[], sortField: string, sortOrder: 'asc' | 'desc'): Product[] {
        console.log('🔧 applySorting - input data length:', data.length, 'sortField:', sortField, 'sortOrder:', sortOrder);
        
        const sortedData = [...data].sort((a, b) => {
            let aValue: any = a[sortField as keyof Product];
            let bValue: any = b[sortField as keyof Product];
            
            // Handle null/undefined values
            if (aValue == null) aValue = '';
            if (bValue == null) bValue = '';
            
            // Convert to string for comparison if needed
            if (typeof aValue === 'string') aValue = aValue.toLowerCase();
            if (typeof bValue === 'string') bValue = bValue.toLowerCase();
            
            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });
        
        console.log('🔧 applySorting - output data length:', sortedData.length);
        return sortedData;
    }

    /**
     * Initialize URL routing for product list
     */
    public initializeURLRouting(): void {
        // Initialize dropdown handler
        this.dropdownHandler.initialize();
        
        // Register sort dropdown if exists
        this.dropdownHandler.registerDropdown({
            dropdownId: 'sort-dropdown',
            paramName: 'sortBy',
            defaultValue: 'name',
            callback: (value: string) => {
                const order = this.urlManager.getCurrentState().sortOrder || 'asc';
                this.setSorting(value, order);
                this.loadDataForPageWithUI(1);
            }
        });

        // Register sort order dropdown if exists
        this.dropdownHandler.registerDropdown({
            dropdownId: 'sort-order-dropdown',
            paramName: 'sortOrder',
            defaultValue: 'asc',
            callback: (value: string) => {
                const sortBy = this.urlManager.getCurrentState().sortBy || 'name';
                this.setSorting(sortBy, value as 'asc' | 'desc');
                this.loadDataForPageWithUI(1);
            }
        });

        // Initialize dropdowns from current URL
        this.dropdownHandler.initializeFromURL();
        
        // Listen for URL changes
        this.dropdownHandler.listenForURLChanges();
        
        // Load initial data from URL parameters
        this.loadDataFromURL();
    }

    /**
     * Load data based on URL parameters
     */
    private loadDataFromURL(): void {
        const urlState = this.urlManager.getCurrentState();
        console.log('🔄 ProductController loading data from URL:', urlState);
        
        // Set sorting from URL
        if (urlState.sortBy) {
            this.setSorting(urlState.sortBy, urlState.sortOrder || 'asc');
        }
        
        // Set pagination from URL
        if (urlState.page) {
            this.currentPage = urlState.page;
        }
        
        // Handle search from URL
        if (urlState.search) {
            console.log('🔍 ProductController loading search from URL:', urlState.search);
            // Set search input value
            setTimeout(() => {
                const searchInputs = document.querySelectorAll<HTMLInputElement>('.search-input, .search-bar_input, input[type="search"]');
                searchInputs.forEach(input => {
                    input.value = urlState.search || '';
                });
            }, 50);
            
            // Perform search
            this.searchProductsWithPagination(urlState.search, this.currentPage);
        }
        // Handle filter from URL
        else if (urlState.filters?.tag) {
            console.log('🏷️ ProductController loading filter from URL:', urlState.filters.tag);
            // Set filter tag active
            setTimeout(() => {
                const filterTags = document.querySelectorAll('.tag-add-searchbar__tag--item');
                filterTags.forEach(tag => {
                    const tagElement = tag.querySelector('.tag-add-searchbar__tag--item-element');
                    if (tagElement?.textContent?.trim() === urlState.filters?.tag) {
                        tag.classList.add('item-active');
                    }
                });
            }, 50);
            
            // Perform filter
            this.handleTagFilterWithPagination(urlState.filters.tag as string, this.currentPage);
        }
        // Load regular data
        else {
            console.log('📄 ProductController loading regular data, page:', this.currentPage);
            this.loadDataForPageWithUI(this.currentPage);
        }
    }

    /**
     * Initialize multiple images handling for product form
     */
    initializeMultipleImagesHandling(): void {
        const isEditMode = !!(window as any).currentProductData;
        if (isEditMode) return;
        
        this.uiHandler.cleanup();
        
        setTimeout(() => {
            const elements = {
                emptyState: document.getElementById('emptyState'),
                previewState: document.getElementById('filledState'),
                imageInput: document.getElementById('imageInputEmpty') || document.getElementById('imageInputFilled'),
                previewContainer: document.getElementById('previewContainer'),
                uploadArea: document.querySelector('.media__upload-area')
            };

            if (elements.emptyState && elements.previewState && elements.imageInput && elements.previewContainer) {
                this.uiHandler.setupMultipleImagesHandling(elements);
            }
        }, 100);
    }
    
    /**
     * Get all uploaded image files
     */
    getUploadedImages(): File[] {
        return this.uiHandler.getImageFiles();
    }
    
    /**
     * SetUp event listeners for product button and form elements
     */
    setupProductForm(): void {
        const isEditMode = !!(window as any).currentProductData;
        
        if (isEditMode) {
            const productData = (window as any).currentProductData;
            
            // Save original data for change detection
            this.saveOriginalProductData(productData);
            
            if (productData?.ImageSrc) {
                this.uiHandler.initializeEditModeImages(productData.ImageSrc);
            }
        } else {
            this.initializeMultipleImagesHandling();
        }
        
        const saveButton = document.querySelector('#saveProductBtn') as HTMLButtonElement;
        if (saveButton) {
            saveButton.addEventListener('click', async () => {
                try {
                    showOverlayLoading();
                    await this.handleSaveProduct();
                } catch (error) {
                    console.error('Error saving product:', error);
                    createToast('Failed to save product. Please try again.', 'error');
                }
                finally {
                    hideOverlayLoading();
                }
            });
        }
    }
    

    async handleSaveProduct(): Promise<void> {
        const isEditMode = (window as any).currentProductData;
        const productId = isEditMode ? (window as any).currentProductData.id : null;
        
        // Check for changes in edit mode
        if (isEditMode && this.productOrigin) {
            const hasChanges = this.hasProductDataChanged();
            console.log('🔍 Product data changed:', hasChanges);
            
            if (!hasChanges) {
                createToast('No changes detected. Product was not updated.', 'info');
                router.navigate('/products');
                return;
            }
        }
        
        // Get form field values
        const nameInput = document.querySelector('input[name="productName"]') as HTMLInputElement;
        const descriptionInput = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
        const stockInput = document.querySelector('input[name="quantity"]') as HTMLInputElement;
        const priceInput = document.querySelector('input[name="price"]') as HTMLInputElement;
        const skuInput = document.querySelector('input[name="sku"]') as HTMLInputElement;
        const barcodeInput = document.querySelector('input[name="barcode"]') as HTMLInputElement;
        const discountTypeSelect = document.querySelector('select[name="discountType"]') as HTMLSelectElement;
        const discountValueInput = document.querySelector('input[name="discountValue"]') as HTMLInputElement;
        const taxClassSelect = document.querySelector('select[name="tax_class"]') as HTMLSelectElement;
        const vatAmountInput = document.querySelector('input[name="vatAmount"]') as HTMLInputElement;
        const categoryDropdown = document.getElementById('dropdownButtonTop') as HTMLDivElement;
        const statusText = document.getElementById('status-text') as HTMLDivElement;
        
        // Simple validation - check required fields
        if (!nameInput?.value.trim()) {
            createToast('Product Name is required', 'error');
            nameInput?.focus();
            return; 
        }
        
        if (!priceInput?.value.trim()) {
            createToast('Price is required', 'error');
            priceInput?.focus();
            return; 
        }
        
        if (!skuInput?.value.trim()) {
            createToast('SKU is required', 'error');
            skuInput?.focus();
            return; 
        }
        
        if (!stockInput?.value.trim()) {
            createToast('Stock is required', 'error');
            stockInput?.focus();
            return; 
        }
        
        // Image validation
        let imageValidation;
        if (isEditMode) {
            const existingImages = (window as any).currentProductData.ImageSrc || {};
            const removedIndices = this.uiHandler.getRemovedImageIndices();
            const newImageFiles = this.getUploadedImages();
            
            imageValidation = ValidationService.validateProductImagesEditMode(existingImages, removedIndices, newImageFiles);
        } else {
            const newImageFiles = this.getUploadedImages();
            imageValidation = ValidationService.validateProductImagesAddMode(newImageFiles);
        }
        
        if (!imageValidation.valid) {
            createToast(imageValidation.message || 'Please add at least one product image', 'error');
            return;
        }
        
        // Collect product data
        const productData: Partial<Product> = {
            name: nameInput.value.trim(),
            description: descriptionInput?.value?.trim() || '',
            stock: parseInt(stockInput.value || '0'),
            price: parseFloat(priceInput.value || '0'),
            sku: skuInput.value.trim(),
            barcode: barcodeInput?.value?.trim() || '',
            discountType: discountTypeSelect?.value || '',
            discount_value: parseFloat(discountValueInput?.value || '0'),
            taxClass: taxClassSelect?.value || '',
            vat_amount: parseFloat(vatAmountInput?.value || '0'),
            categoryID: categoryDropdown?.getAttribute('data-selected-id') || '',
            category: categoryDropdown?.textContent?.trim() || '',
            status: statusText?.textContent?.trim() || 'Draft',
            quantity: parseInt(stockInput.value || '0'),
            added: isEditMode ? (window as any).currentProductData.added : new Date().toISOString(),
        };
        
        // Handle images
        if (isEditMode) {
            const existingImages = (window as any).currentProductData.ImageSrc || {};
            const removedIndices = this.uiHandler.getRemovedImageIndices();
            const newImageFiles = this.getUploadedImages();
            
            const finalImages = {
                firstImg: existingImages.firstImg || '',
                secondImg: existingImages.secondImg || '',
                thirdImg: existingImages.thirdImg || ''
            };
            
            // Remove marked images
            removedIndices.forEach(slotName => {
                if (finalImages[slotName as keyof typeof finalImages] !== undefined) {
                    finalImages[slotName as keyof typeof finalImages] = '';
                }
            });
            
            // Upload new images
            if (newImageFiles.length > 0) {
                const uploadedUrls: string[] = [];
                
                for (const file of newImageFiles) {
                    const url = await uploadToCloudinary(file);
                    uploadedUrls.push(url);
                }
                
                // Fill empty slots
                const imageSlots = ['firstImg', 'secondImg', 'thirdImg'] as const;
                let uploadIndex = 0;
                
                for (const slot of imageSlots) {
                    if (!finalImages[slot] && uploadIndex < uploadedUrls.length) {
                        finalImages[slot] = uploadedUrls[uploadIndex];
                        uploadIndex++;
                    }
                }
            }
            
            productData.ImageSrc = finalImages;
        } else {
            const imageFiles = this.getUploadedImages();
            const imageUrls: string[] = [];

            for (const file of imageFiles) {
                const url = await uploadToCloudinary(file);
                imageUrls.push(url);
            }
            
            productData.ImageSrc = {
                firstImg: imageUrls[0] || '',
                secondImg: imageUrls[1] || '',
                thirdImg: imageUrls[2] || ''
            };
        }
        
        // Save product
        showOverlayLoading();
        
        if (isEditMode && productId) {
            await this.productService.updateProduct(productId, productData as Product);
            createToast('Product updated successfully!', 'success');
        } else {
            await this.productService.createProduct(productData as Product);
            createToast('Product created successfully!', 'success');
        }
        
        hideOverlayLoading();
        router.navigate('/products');      
    }   

    /**
     * Override sortAndReload to update URL when sorting
     */
    public async sortAndReload(field: string): Promise<void> {
        this.toggleSort(field);
        
        // Get current URL state to preserve filter/search
        const currentState = this.urlManager.getCurrentState();
        console.log('🔄 ProductController sortAndReload - currentState BEFORE update:', currentState);
        console.log('🔄 ProductController sortAndReload - currentState.filters:', currentState.filters);
        
        // Update URL with new sort parameters while preserving existing state
        this.urlManager.updateState({
            ...currentState,
            sortBy: this.sortField,
            sortOrder: this.sortOrder,
            page: 1 // Reset to page 1 when sorting
        });
        
        // Get state after update to verify
        const stateAfterUpdate = this.urlManager.getCurrentState();
        console.log('🔄 ProductController sortAndReload - currentState AFTER update:', stateAfterUpdate);
        console.log('🔄 ProductController sortAndReload - stateAfterUpdate.filters:', stateAfterUpdate.filters);
        
        // Check if we're in filter mode or search mode
        if (currentState.filters?.tag) {
            console.log('🏷️ ProductController sortAndReload - applying filter with tag:', currentState.filters.tag);
            // Re-apply filter with new sort
            await this.handleTagFilterWithPagination(currentState.filters.tag as string, 1);
        } else if (currentState.search) {
            console.log('🔍 ProductController sortAndReload - applying search with query:', currentState.search);
            // Re-apply search with new sort
            await this.searchProductsWithPagination(currentState.search, 1);
        } else {
            console.log('📄 ProductController sortAndReload - loading regular data');
            // Regular data with sort
            await this.loadDataForPageWithUI(1);
        }
    }

    /**
     * Override loadDataForPageWithUI to update URL when pagination changes
     */
    public async loadDataForPageWithUI(page: number): Promise<void> {
        // Get current URL state to preserve filter/search
        const currentState = this.urlManager.getCurrentState();
        console.log('📄 ProductController loadDataForPageWithUI - currentState:', currentState, 'page:', page);
        
        // Update URL with new page while preserving existing state
        this.urlManager.updateState({
            ...currentState,
            page: page,
            sortBy: this.sortField || undefined,
            sortOrder: this.sortOrder || undefined
        });

        // Check if we're in filter mode or search mode first
        if (currentState.filters?.tag) {
            console.log('🏷️ ProductController loadDataForPageWithUI - calling handleTagFilterWithPagination with tag:', currentState.filters.tag);
            // We're in filter mode - use tag filter instead of regular load
            await this.handleTagFilterWithPagination(currentState.filters.tag as string, page);
            return;
        } else if (currentState.search) {
            console.log('🔍 ProductController loadDataForPageWithUI - calling searchProductsWithPagination with query:', currentState.search);
            // We're in search mode - use search instead of regular load
            await this.searchProductsWithPagination(currentState.search, page);
            return;
        }

        console.log('📄 ProductController loadDataForPageWithUI - loading regular data');
        // Call parent method for regular data loading
        await super.loadDataForPageWithUI(page);
    }

    private saveOriginalProductData(product: Product): void {
        this.productOrigin = {
            ...product,
            ImageSrc: product.ImageSrc ? {
                firstImg: product.ImageSrc.firstImg || '',
                secondImg: product.ImageSrc.secondImg || '',
                thirdImg: product.ImageSrc.thirdImg || ''
            } : { firstImg: '', secondImg: '', thirdImg: '' }
        };
    }

    /**
     * Get current form data for comparison
     */
    private getCurrentFormData(): Partial<Product> {
        const nameInput = document.querySelector('input[name="productName"]') as HTMLInputElement;
        const descriptionInput = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
        const stockInput = document.querySelector('input[name="quantity"]') as HTMLInputElement;
        const priceInput = document.querySelector('input[name="price"]') as HTMLInputElement;
        const skuInput = document.querySelector('input[name="sku"]') as HTMLInputElement;
        const barcodeInput = document.querySelector('input[name="barcode"]') as HTMLInputElement;
        const discountTypeSelect = document.querySelector('select[name="discountType"]') as HTMLSelectElement;
        const discountValueInput = document.querySelector('input[name="discountValue"]') as HTMLInputElement;
        const taxClassSelect = document.querySelector('select[name="tax_class"]') as HTMLSelectElement;
        const vatAmountInput = document.querySelector('input[name="vatAmount"]') as HTMLInputElement;
        const categoryDropdown = document.getElementById('dropdownButtonTop') as HTMLDivElement;
        const statusText = document.getElementById('status-text') as HTMLDivElement;

        return {
            name: nameInput?.value.trim() || '',
            description: descriptionInput?.value?.trim() || '',
            stock: parseInt(stockInput?.value || '0'),
            price: parseFloat(priceInput?.value || '0'),
            sku: skuInput?.value.trim() || '',
            barcode: barcodeInput?.value?.trim() || '',
            discountType: discountTypeSelect?.value || '',
            discount_value: parseFloat(discountValueInput?.value || '0'),
            taxClass: taxClassSelect?.value || '',
            vat_amount: parseFloat(vatAmountInput?.value || '0'),
            categoryID: categoryDropdown?.getAttribute('data-selected-id') || '',
            category: categoryDropdown?.textContent?.trim() || '',
            status: statusText?.textContent?.trim() || 'Draft',
            quantity: parseInt(stockInput?.value || '0')
        };
    }

    /**
     * Check if product data has changed
     */
    private hasProductDataChanged(): boolean {
        if (!this.productOrigin) return false;

        const currentData = this.getCurrentFormData();
        const original = this.productOrigin;

        // Compare basic fields
        const fieldsToCompare = [
            'name', 'description', 'price', 'stock', 'sku', 'barcode',
            'discountType', 'discount_value', 'taxClass', 'vat_amount',
            'categoryID', 'category', 'status', 'quantity'
        ];

        for (const field of fieldsToCompare) {
            if (currentData[field as keyof Product] !== original[field as keyof Product]) {
                console.log(`🔍 Field '${field}' changed:`, 
                    `'${original[field as keyof Product]}' -> '${currentData[field as keyof Product]}'`);
                return true;
            }
        }

        // Check image changes
        const currentImages = this.getCurrentImageState();
        const originalImages = original.ImageSrc || { firstImg: '', secondImg: '', thirdImg: '' };
        
        if (JSON.stringify(currentImages) !== JSON.stringify(originalImages)) {
            console.log('🔍 Images changed:', originalImages, '->', currentImages);
            return true;
        }

        return false;
    }

    /**
     * Get current image state including new uploads and removals
     */
    private getCurrentImageState(): { firstImg: string; secondImg: string; thirdImg: string } {
        const existingImages = (window as any).currentProductData?.ImageSrc || {};
        const removedIndices = this.uiHandler.getRemovedImageIndices();
        const newImageFiles = this.getUploadedImages();

        const currentImages = {
            firstImg: existingImages.firstImg || '',
            secondImg: existingImages.secondImg || '',
            thirdImg: existingImages.thirdImg || ''
        };

        // Apply removals
        removedIndices.forEach(slotName => {
            if (currentImages[slotName as keyof typeof currentImages] !== undefined) {
                currentImages[slotName as keyof typeof currentImages] = '';
            }
        });

        // Apply new uploads (simulate URLs for comparison)
        const imageSlots = ['firstImg', 'secondImg', 'thirdImg'] as const;
        let uploadIndex = 0;
        
        for (const slot of imageSlots) {
            if (!currentImages[slot] && uploadIndex < newImageFiles.length) {
                currentImages[slot] = `new_upload_${uploadIndex}`;
                uploadIndex++;
            }
        }

        return currentImages;
    }

}

export default ProductController;