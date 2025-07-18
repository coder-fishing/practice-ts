
export class CategoryFormEventHandler {
    private static instance: CategoryFormEventHandler;
    private initialized = false;

    public static getInstance(): CategoryFormEventHandler {
        if (!CategoryFormEventHandler.instance) {
            CategoryFormEventHandler.instance = new CategoryFormEventHandler();
        }
        return CategoryFormEventHandler.instance;
    }

    public initialize(): void {
        if (this.initialized) return;
        
        document.addEventListener('click', this.handleFormClick.bind(this));
        document.addEventListener('change', this.handleImageChange.bind(this));
        this.initialized = true;
    }

    private handleFormClick(event: Event): void {
        const target = event.target as HTMLElement;
        
        // Handle add image button click
        if (target.classList.contains('thumbnail__add-btn') || 
            target.classList.contains('thumbnail__add-btn--text')) {
            this.handleAddImageClick(event);
        }
        
        // Handle remove image button click
        if (target.classList.contains('thumbnail__preview-remove')) {
            this.handleRemoveImageClick(event);
        }
    }

    private handleAddImageClick(event: Event): void {
        event.preventDefault();
        const imageInput = document.getElementById('imageInput') as HTMLInputElement;
        if (imageInput) {
            imageInput.click();
        }
    }

    private handleRemoveImageClick(event: Event): void {
        event.preventDefault();
        
        const imageInput = document.getElementById('imageInput') as HTMLInputElement;
        const previewImage = document.getElementById('previewImage') as HTMLImageElement;
        const emptyState = document.getElementById('emptyState') as HTMLElement;
        const previewState = document.getElementById('previewState') as HTMLElement;
        
        if (imageInput) imageInput.value = '';
        if (previewImage) previewImage.src = '';
        if (emptyState) emptyState.style.display = 'flex';
        if (previewState) previewState.style.display = 'none';
    }

    private handleImageChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        
        if (target.id === 'imageInput' && target.files && target.files[0]) {
            const file = target.files[0];
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const previewImage = document.getElementById('previewImage') as HTMLImageElement;
                const emptyState = document.getElementById('emptyState') as HTMLElement;
                const previewState = document.getElementById('previewState') as HTMLElement;
                
                if (previewImage && e.target?.result) {
                    previewImage.src = e.target.result as string;
                }
                if (emptyState) emptyState.style.display = 'none';
                if (previewState) previewState.style.display = 'block';
            };
            
            reader.readAsDataURL(file);
        }
    }

    /**
     * Reset the form handler state
     */
    public reset(): void {
        this.initialized = false;
        document.removeEventListener('click', this.handleFormClick);
        document.removeEventListener('change', this.handleImageChange);
    }
}
