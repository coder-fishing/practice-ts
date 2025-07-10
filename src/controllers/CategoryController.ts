import CategoryService from "~/services/CategoryService";
import { BaseController } from './BaseController';
import type { Category as CategoryType } from '~/types/category.type';
import CategoryUIHandler from "../UIHandler/CategoryUIHandler";
import uploadToCloudinary from "../utils/uploadToCloudinary";
import { hideOverlayLoading, showOverlayLoading } from '~/view/components/loading';
import { router } from "../router/Router";
import { createToast } from "~/utils/toast";


export class CategoryController extends BaseController<CategoryType> {
    private static instance: CategoryController;
    private categoryService: CategoryService;
    uiHandler: CategoryUIHandler;

    // To track original category data for change detection
    private originalCategoryData: CategoryType | null = null;
    // To track if save button is already initialized
    private saveButtonInitialized: boolean = false;

    constructor() {
        super();
        this.categoryService = new CategoryService();
        this.uiHandler = new CategoryUIHandler();
    }

    public static getInstance(): CategoryController {
        if (!CategoryController.instance) {
            CategoryController.instance = new CategoryController();
        }
        return CategoryController.instance;
    }

    /**
     * Implement abstract method từ BaseController
     */
    protected async getServicePaginated(page: number, limit: number) {
        return this.categoryService.getCategoriesPaginated(page, limit);
    }

    /**
     * Get all categories
     */
    public async getAllCategories() {
        return this.categoryService.getAllCategories();
    }

    /**
     * Get categories with pagination
     */
    public async getCategoriesPaginated(page: number = 1, limit: number = 10, sort?: string, order?: string) {
        return this.categoryService.getCategoriesPaginated(page, limit, sort, order);
    }

    /**
     * Get category by ID
     */
    public async getCategoryById(id: number) {
        return this.categoryService.getCategoryById(id);
    }

    /**
     * Create new category
     */
    public async createCategory(categoryData: any) {
        return this.categoryService.createCategory(categoryData);
    }

    /**
     * Update category
     */
    public async updateCategory(id: number, categoryData: any) {
        return this.categoryService.updateCategory(id, categoryData);
    }

    /**
     * Delete category
     */
    public async deleteCategory(id: number) {
        return this.categoryService.deleteCategory(id);
    }

    /**
     * Search categories by query
     */
    public async searchCategories(query: string, page: number, limit: number): Promise<CategoryType[]> {
        return this.categoryService.searchCategories(query, page, limit);
    }

    /**
     * Search categories with pagination support
     */
    public async searchCategoriesWithPagination(query: string, page: number = 1): Promise<void> {
        const allResults = await this.searchCategories(query, 1, 1000);
        const pageSize = this.itemsPerPage || 6;
        const totalItems = allResults.length;
        const startIndex = (page - 1) * pageSize;
        const paginatedResults = allResults.slice(startIndex, pageSize);
        
        const searchResult = {
            data: paginatedResults,
            paginationInfo: {
                currentPage: page,
                itemsPerPage: pageSize,
                totalItems: totalItems,
                totalPages: Math.ceil(totalItems / pageSize),
                start: startIndex + 1,
                end: Math.min(startIndex + pageSize, totalItems)
            },
            isSearchResult: true,
            searchQuery: query,
            allSearchResults: allResults
        };

        this.triggerSuccess(searchResult);
    }

    /**
     * Handle search functionality
     */
    public handleSearch(): void {
        const searchInputs = document.querySelectorAll<HTMLInputElement>('.search-input, .search-bar_input, input[type="search"]');
        let searchTimeout: number | null = null;
        
        searchInputs.forEach((searchInput) => {
            searchInput.addEventListener('input', async (event) => {
                const query = (event.target as HTMLInputElement).value.trim();
                
                if (searchTimeout) clearTimeout(searchTimeout);
                
                searchTimeout = window.setTimeout(async () => {
                    if (query.length >= 2) {
                        await this.searchCategoriesWithPagination(query, 1);
                    } else if (query.length === 0) {
                        this.loadDataForPageWithUI(1);
                    }
                }, 300);
            });
        });
    }
    
    /**
     * Initialize search with automatic setup
     */
    public initializeSearch(): void {
        this.handleSearch();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.handleSearch(), 100);
            });
        }
    }

    /** 
     * Initialize image handling
     */  
    initializeImageHandling() {
        const elements = {
            emptyState: document.getElementById('emptyState'),
            previewState: document.getElementById('previewState'),
            imageInput: document.getElementById('imageInput') as HTMLInputElement,
            previewImage: document.getElementById('previewImage') as HTMLImageElement,
            uploadArea: document.querySelector('.thumbnail__upload-area') as HTMLElement
        };

        if (elements.emptyState && elements.previewState && elements.imageInput) {
            this.uiHandler.setupImageHandling(elements);
        }
    }

    /**
     * Validate category data
     */
    validateCategoryData(categoryData: any): boolean {
        return !!(categoryData.name && categoryData.name.trim());
    }

    /**
     * Upload image to cloudinary
     */
    async handleUploadImage(file: File): Promise<string> {
        return uploadToCloudinary(file);
    }

    /**
     * Setup save category button
     */
    setupSaveCategoryButton(): void {
        // Prevent duplicate initialization
        if (this.saveButtonInitialized) {
            return;
        }

        const submitBtn = document.querySelector('#saveCategoryBtn') as HTMLButtonElement;
        
        if (!submitBtn) {
            console.error('Save category button not found');
            return;
        }

        submitBtn.addEventListener('click', async () => {
            await this.handleSaveCategory();
        });

        this.saveButtonInitialized = true;
    }

    /**
     * Handle save category form submission
     */
    async handleSaveCategory(): Promise<void> {
        const submitBtn = document.querySelector('#saveCategoryBtn') as HTMLButtonElement;
        const imageInput = document.getElementById('imageInput') as HTMLInputElement;
        const descriptionInput = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
        const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
        
        // Check if we're in edit mode
        const categoryId = new URLSearchParams(window.location.search).get('id') ||
                          window.location.pathname.split('/').pop();
        const isEditMode = !!(categoryId && categoryId !== 'addcategory' && !isNaN(parseInt(categoryId)));

        // Simple validation
        if (!nameInput?.value.trim()) {
            createToast('Please enter category name', 'error');
            nameInput?.focus();
            return;
        }

        if (!descriptionInput?.value.trim()) {
            createToast('Please enter category description', 'error');
            descriptionInput?.focus();
            return;
        }

        // Check for changes in edit mode
        if (isEditMode && !this.hasDataChanged()) {
            createToast('No changes detected. Navigating back to category list.', 'info');
            router.navigate('/category');
            return;
        }

        if (!imageInput?.files || imageInput.files.length === 0) {
              createToast('Please select an image', 'error');
              return
        }

        submitBtn.disabled = true;
        showOverlayLoading();

        try {
            const categoryData: any = {
                name: nameInput.value.trim(),
                description: descriptionInput.value.trim(),
                image: '',
                sold: 0,
                stock: 0,
                createdAt: Date.now()
            };

            // Handle image upload
            if (imageInput.files && imageInput.files[0]) {
                categoryData.image = await this.handleUploadImage(imageInput.files[0]);
            } else if (isEditMode) {
                const previewImg = document.getElementById('previewImage') as HTMLImageElement;
                if (previewImg?.src && !previewImg.src.includes('data:')) {
                    categoryData.image = previewImg.src;
                }
            }

            if (isEditMode) {
                await this.updateCategory(parseInt(categoryId), categoryData);
                createToast('Category updated successfully!', 'success');
            } else {
                await this.createCategory(categoryData);
                createToast('Category created successfully!', 'success');
            }

            // Reset controller state before navigation
            router.navigate('/category');
            
        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'creating'} category:`, error);
            createToast(`Failed to ${isEditMode ? 'update' : 'create'} category`, 'error');
        } finally {
            submitBtn.disabled = false;
            hideOverlayLoading();
        }
    }

    /**
     * @deprecated Use handleSaveCategory instead
     */
    async handleAddCategory(): Promise<void> {
        console.warn('⚠️ handleAddCategory is deprecated, use handleSaveCategory instead');
        return this.handleSaveCategory();
    }

    /**
     * Handle delete category
     */ 
    async handleDeleteCategory(categoryId: number): Promise<void> {
        if (!categoryId) return;

        try {
            showOverlayLoading();
            await this.deleteCategory(categoryId);
            this.loadDataForPageWithUI(1);
            createToast('Category deleted successfully!', 'success');
        } catch (error) {
            createToast('Failed to delete category', 'error');
        } finally {
            hideOverlayLoading();
        }
    }

    /**
     * Global click handler for category interactions
     */
    handleGlobalClick = async (event: Event): Promise<void> => {
        if (!event.target) return;

        const target = event.target as Element;
        
        // Check if we're in category context (not product context)
        const categoryTable = target.closest('.category-table, [data-context="category"]');
        const categoryPage = window.location.pathname.includes('/category') || 
                           window.location.pathname.includes('/editcategory') ||
                           window.location.pathname.includes('/addcategory');
        
        // Only handle category actions when in category context
        if (!categoryTable && !categoryPage) {
            return;
        }
    
        // Edit button handler - Support nhiều selector khác nhau
        const editButton = target.closest('.product-table__item--action--edit, .product-table__edit, .edit-btn, [data-action="edit"]');
        
        if (editButton) {
            event.preventDefault();
            
            
            const categoryId = editButton.getAttribute('data-id') || 
                             editButton.closest('[data-id]')?.getAttribute('data-id');
            
            if (categoryId) {
                
                router.navigate(`/editcategory/${categoryId}`);
            }
            return;
        }

        // Delete button handler
        const deleteButton = target.closest('.product-table__item--action--delete, .delete-btn');
        if (deleteButton) {
            event.preventDefault();
            
            
            const categoryId = deleteButton.getAttribute('data-id') || 
                             deleteButton.closest('[data-id]')?.getAttribute('data-id');
            
            if (categoryId) {
                // Confirm deletion
                const confirmDelete = confirm(`Are you sure you want to delete this category?`);
                if (confirmDelete) {
                    
                    try {
                        await this.handleDeleteCategory(parseInt(categoryId));
                    } catch (error) {
                        console.error('❌ Error in delete button handler:', error);
                    }
                }
            }
            return;
        }
    }

    /**
     * Setup table interactions
     */
    setupTableInteractions(): void {
        const categoryPage = window.location.pathname.includes('/category');
        if (!categoryPage) return;
        
        document.removeEventListener('click', this.handleGlobalClick);
        document.addEventListener('click', this.handleGlobalClick);
    }

    /**
     * Initialize category controller
     */
    initializeController(): void {
        this.setupTableInteractions();
        this.initializeSearch();
        
        const saveBtn = document.querySelector('#saveCategoryBtn');
        if (saveBtn) {
            this.setupSaveCategoryButton();
        }
        
        const imageInput = document.querySelector('#imageInput');
        if (imageInput) {
            this.initializeImageHandling();
        }
    }

    /**
     * Load category data and populate form for edit mode
     */
    async loadCategoryForEdit(categoryId: string): Promise<void> {
        try {
            const category = await this.getCategoryById(parseInt(categoryId));
            
            if (!category) {
                createToast('Category not found', 'error');
                return;
            }
            
            // Populate form with category data
            this.populateFormWithCategoryData(category);
            
            // Save original data for change tracking
            this.saveOriginalCategoryData(category);
            
        } catch (error) {
            console.error('❌ Error loading category:', error);
            createToast('Failed to load category data', 'error');
        }
    }

    /**
     * Populate form fields with category data
     */
    private populateFormWithCategoryData(category: CategoryType): void {
        // Populate name input
        const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
        if (nameInput && category.name) {
            nameInput.value = category.name;
        }
        
        // Populate description input
        const descriptionInput = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
        if (descriptionInput && category.description) {
            descriptionInput.value = category.description;
        }
        
        // Handle image preview if category has image
        if (category.image) {
            this.setupImagePreview(category.image);
        }
    }

    /**
     * Setup image preview in form
     */
    private setupImagePreview(imageUrl: string): void {
        const emptyState = document.getElementById('emptyState');
        const previewState = document.getElementById('previewState');
        const previewImage = document.getElementById('previewImage') as HTMLImageElement;
        
        if (emptyState && previewState && previewImage) {
            emptyState.style.display = 'none';
            previewState.style.display = 'block';
            previewImage.src = imageUrl;
        }
    }

    /**
     * Initialize edit category page
     */
    async initializeEditPage(categoryId: string): Promise<void> {
        // Initialize all basic functionality
        this.initializeImageHandling();
        this.setupSaveCategoryButton();
        
        // Load category data for edit
        await this.loadCategoryForEdit(categoryId);
    }

    /**
     * Save original category data from database
     */
    private saveOriginalCategoryData(categoryData: CategoryType): void {
        this.originalCategoryData = {
            ...categoryData
        };
    }

    /**
     * Get current form data as category object
     */
    private getCurrentCategoryData(): { name: string; description: string; image: string } {
        const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
        const descriptionInput = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
        const previewImage = document.getElementById('previewImage') as HTMLImageElement;
        const imageInput = document.getElementById('imageInput') as HTMLInputElement;
        
        let currentImageValue = '';
        
        // Check if there's a new file selected
        if (imageInput?.files && imageInput.files[0]) {
            // For new files, we'll need to compare after upload
            currentImageValue = 'NEW_FILE_SELECTED';
        } else if (previewImage?.src && !previewImage.src.includes('data:')) {
            // Use existing image URL
            currentImageValue = previewImage.src;
        }
        
        return {
            name: nameInput?.value?.trim() || '',
            description: descriptionInput?.value?.trim() || '',
            image: currentImageValue
        };
    }

    /**
     * Check if current form data differs from original database data
     */
    private hasDataChanged(): boolean {
        if (!this.originalCategoryData) {
            return true; // Consider changed if no original data
        }

        const currentData = this.getCurrentCategoryData();
        
        // Check if new file is selected
        if (currentData.image === 'NEW_FILE_SELECTED') {
            return true;
        }
        
        return (
            this.originalCategoryData.name !== currentData.name ||
            this.originalCategoryData.description !== currentData.description ||
            this.originalCategoryData.image !== currentData.image
        );
    }


}
export default CategoryController;