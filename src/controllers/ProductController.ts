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

export class ProductController extends BaseController<Product> {
    private static instance: ProductController;
    private productService: ProductService;
    uiHandler: ProductUIHandler;
    private searchHandler: SearchHandler;
    private tableHandler: TableInteractionHandler;
    private filterHandler: FilterHandler;

    constructor() {
        super();
        this.productService = new ProductService();
        this.uiHandler = new ProductUIHandler();
        
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
        
        if (tag === 'Published') {
            return products.filter(product => product.status?.toLowerCase() === 'published');
        } else if (tag === 'Draft') {
            return products.filter(product => product.status?.toLowerCase() === 'draft');
        } else if (tag === 'Low Stock') {
            return products.filter(product => product.status?.toLowerCase() === 'low stock');
        }
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
    }

    /**
     * Search with pagination
     */
    public async searchProductsWithPagination(query: string, page: number = 1): Promise<void> {
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
        return this.filterHandler.handleTagFilterWithPagination(tag, page);
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
            if (productData?.ImageSrc) {
                this.uiHandler.initializeEditModeImages(productData.ImageSrc);
            }
        } else {
            this.initializeMultipleImagesHandling();
        }
        
        const saveButton = document.querySelector('#saveProductBtn') as HTMLButtonElement;
        if (saveButton) {
            saveButton.addEventListener('click', async () => {
                await this.handleSaveProduct()
            });
        }
    }
    

    async handleSaveProduct(): Promise<void> {
        const isEditMode = (window as any).currentProductData;
        const productId = isEditMode ? (window as any).currentProductData.id : null;
        
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

}

export default ProductController;