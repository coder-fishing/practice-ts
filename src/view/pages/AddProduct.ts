import { breadCrumbs } from '~/view/components/breadCrumb';
import { BUTTON_GROUPS } from '~/constant';
import { groupButton } from '~/view/components/groupButton';
import { BREADCRUMBS } from '~/constant';
import { ProductController } from '~/controllers/ProductController';
import { productForm } from '~/view/components/form/productForm';
import CategoryController from '~/controllers/CategoryController';

const productController = ProductController.getInstance();
const categoryController = CategoryController.getInstance();

// Async function to initialize AddProduct with categories
async function initializeWithCategories() {
    try {
        // Fetch categories before initializing dropdowns
        const categories = await categoryController.getAllCategories();
        
        
        // Store categories in window for dropdown access
        (window as any).productCategories = categories || [];
    } catch (err) {
        console.error('❌ Failed to load categories:', err);
        (window as any).productCategories = [];
    }
}

// Start loading categories immediately

export const AddProduct = (): string => {
    // Generate HTML first
    const html = `
    <div class="product-list">
            <div class="product-title">
                <div class="product-title-left">
                    <p class="product-title-left__name">Product</p>
                    ${breadCrumbs(
                        BREADCRUMBS.ADD_PRODUCT.items,
                        BREADCRUMBS.PRODUCT_LIST.icon
                    )}
                </div>   
                    ${groupButton(BUTTON_GROUPS.FORM.PRODUCT)} 
            </div>
            ${productForm({
                productData: {
                    id: 0,
                    name: '',
                    sku: '',
                    category: '',
                    price: 0,
                    status: 'Draft',
                    quantity: 0,
                    description: '',
                    barcode: '',
                    tax_class: '',
                    discountType: '',
                    discountValue: 0,
                    vatAmount: 0,
                } as any, // Basic empty product structure with required fields
                mode: 'add',
                onSubmit: (_data: any) => {
                    
                }
            })}

        </div>
    `;
    
    // Setup after DOM is ready
    setTimeout(() => {
        console.log('🔄 AddProduct: Setting up UI handlers...');
        
        // Complete reset for Add mode
        productController.uiHandler.resetForAddMode();
        
        // Setup product form
        productController.setupProductForm();
        
        // Initialize categories and dropdowns
        initializeWithCategories();
        productController.uiHandler.loadCategories();
        productController.uiHandler.setupStatusDropdownItems();
    }, 500);
    
    return html;
}