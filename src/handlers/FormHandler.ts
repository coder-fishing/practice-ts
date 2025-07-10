import { showOverlayLoading, hideOverlayLoading } from '~/view/components/loading';
import { createToast } from '~/utils/toast';

// Form handler for save operations
export class FormHandler {
    private saveCallback: (data: any, isEdit: boolean, id?: number) => Promise<any>;
    private router: any;
    private entityName: string;
    private redirectRoute: string;

    constructor(
        saveCallback: (data: any, isEdit: boolean, id?: number) => Promise<any>,
        router: any,
        entityName: string = 'item',
        redirectRoute: string = '/'
    ) {
        this.saveCallback = saveCallback;
        this.router = router;
        this.entityName = entityName;
        this.redirectRoute = redirectRoute;
    }

    /**
     * Setup save button listener
     */
    public setupSaveButton(buttonSelector: string): void {
        const saveButton = document.querySelector(buttonSelector) as HTMLButtonElement;

        if (!saveButton) {
            console.error(`❌ Save button not found: ${buttonSelector}`);
            return;
        }

        // Remove existing listeners to prevent duplicates
        const newButton = saveButton.cloneNode(true) as HTMLButtonElement;
        saveButton.parentNode?.replaceChild(newButton, saveButton);

        newButton.addEventListener('click', async () => {
            await this.handleSave();
        });

        console.log(`✅ Save button setup completed for ${this.entityName}`);
    }

    /**
     * Handle save operation
     */
    public async handleSave(): Promise<void> {
        console.log(`🔄 Processing ${this.entityName} form submission...`);
        
        try {
            showOverlayLoading();

            // Detect edit mode
            const isEditMode = !!(window as any).currentProductData || !!(window as any).currentCategoryData;
            const entityData = (window as any).currentProductData || (window as any).currentCategoryData;
            const entityId = isEditMode ? entityData?.id : null;

            // Collect form data (this should be overridden by specific implementations)
            const formData = this.collectFormData();

            // Validate form data
            if (!this.validateFormData(formData)) {
                hideOverlayLoading();
                return;
            }

            // Call save callback
            await this.saveCallback(formData, isEditMode, entityId);

            // Show success message
            const action = isEditMode ? 'updated' : 'created';
            createToast(`${this.entityName} ${action} successfully!`, 'success');

            // Navigate to list page
            this.router.navigate(this.redirectRoute);

        } catch (error) {
            console.error(`❌ Error saving ${this.entityName}:`, error);
            createToast(`Failed to save ${this.entityName}. Please try again.`, 'error');
        } finally {
            hideOverlayLoading();
        }
    }

    /**
     * Collect form data - should be overridden by specific implementations
     */
    protected collectFormData(): any {
        console.warn('collectFormData should be overridden by specific implementations');
        return {};
    }

    /**
     * Validate form data - should be overridden by specific implementations
     */
    protected validateFormData(_formData: any): boolean {
        console.warn('validateFormData should be overridden by specific implementations');
        return true;
    }
}
