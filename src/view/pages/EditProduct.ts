import { breadCrumbs } from '~/view/components/breadCrumb';
import { BUTTON_GROUPS } from '~/constant';
import { groupButton } from '~/view/components/groupButton';
import { BREADCRUMBS } from '~/constant';
import { ProductController } from '~/controllers/ProductController';
import { productForm } from '~/view/components/form/productForm';

const productController = ProductController.getInstance();

export const EditProduct = (params?: { id: string }): string => {
    const productId = params?.id;

    if (!productId) {
        return '<div class="error-container"><h3>Error</h3><p>Product ID is required to edit a product.</p></div>';
    }

    // Generate loading HTML first
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
        <div id="product-form-container"></div>
    </div>
    `;

    // Load product data and setup form asynchronously
    setTimeout(async () => {
        const product = await productController.getProductById(parseInt(productId));
        
        // Store product data for form access
        (window as any).currentProductData = product;

        // Generate and inject the form HTML
        const formHtml = productForm({
            productData: {
                id: parseInt(productId),
                name: product.name || '',
                sku: product.sku || '',
                category: product.category || '',
                categoryID: product.categoryID || '',
                price: product.price || 0,
                status: product.status || 'Draft',
                quantity: product.quantity || 0,
                stock: product.stock || 0,
                description: product.description || '',
                barcode: product.barcode || '',
                taxClass: product.taxClass || '',
                discountType: product.discountType || '',
                discount_value: product.discount_value || 0,
                vat_amount: product.vat_amount || 0,
                added: product.added || '',
                ImageSrc: {
                    firstImg: product.ImageSrc?.firstImg || '',
                    secondImg: product.ImageSrc?.secondImg || '',
                    thirdImg: product.ImageSrc?.thirdImg || ''
                },
            },
            mode: 'edit',
            onSubmit: (_data: any) => {
                // Handle form submission logic here
            }
        });

        // Replace loading content with actual form
        const container = document.getElementById('product-form-container');
        if (container) {
            container.innerHTML = formHtml;
        }

        // Setup UI handlers after form is injected
        setTimeout(() => {
            productController.uiHandler.resetForEditMode();
            productController.uiHandler.loadCategories();
            productController.uiHandler.setupStatusDropdownItems();
            productController.setupProductForm();
            
            // Setup table event listeners for edit/delete buttons
            productController.setupTableEventListeners();
            
            setTimeout(() => {
                productController.uiHandler.initializeEditModeImages({
                    firstImg: product.ImageSrc?.firstImg,
                    secondImg: product.ImageSrc?.secondImg,
                    thirdImg: product.ImageSrc?.thirdImg
                });
                
                setTimeout(() => {
                    const elements = {
                        emptyState: document.getElementById('emptyState'),
                        previewState: document.getElementById('filledState'),
                        imageInput: document.getElementById('imageInputFilled') || document.getElementById('imageInputEmpty'),
                        previewContainer: document.getElementById('previewContainer'),
                        uploadArea: document.querySelector('.thumbnail__upload-area')
                    };
                    productController.uiHandler.setupForEditMode(elements);
                }, 200);
            }, 500);
        }, 100);
    }, 100);

    return html;
};
