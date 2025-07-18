import { breadCrumbs } from '~/view/components/breadCrumb';
import { BUTTON_GROUPS } from '~/constant';
import { groupButton } from '~/view/components/groupButton';
import { BREADCRUMBS } from '~/constant';
import { categoryForm } from '~/view/components/form/categoryForm';
import { CategoryController } from '../../controllers/CategoryController';

const categoryController = CategoryController.getInstance();

export const EditCategory = (params?: { id: string }): string => {
    const categoryId = params?.id;
    
    // Setup all event handlers after DOM is ready
    setTimeout(async () => {
        
        // Reset save button flag for new session
        categoryController.resetSaveButtonFlag();
        
        // Initialize all controller functionality (including all event listeners)
        categoryController.initializeController();
        
        // Load category data if ID is provided (for edit mode)
        if (categoryId) {
            await categoryController.loadCategoryForEdit(categoryId);
        }
    }, 100);

    return `
    <div class="product-list">
        <div class="product-title">
            <div class="product-title-left">
                <p class="product-title-left__name">Edit Category </p>
                ${breadCrumbs(
                    BREADCRUMBS.ADD_CATEGORY.items,
                    BREADCRUMBS.PRODUCT_LIST.icon
                )}
            </div>   
                ${groupButton(BUTTON_GROUPS.FORM.CATEGORY)} 
        </div>
        ${categoryForm({
            categoryData: { categoryID: categoryId } as any,
            mode: 'edit'
        })}
    </div>
    `
}