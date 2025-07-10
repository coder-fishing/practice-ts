// Validation service for form data validation
export class ValidationService {
    
    /**
     * Validate category data
     */
    public static validateCategory(categoryData: any): { valid: boolean; errors: string[] } {
        const errors: string[] = [];
        
        // Name validation
        if (!categoryData.name || typeof categoryData.name !== 'string' || categoryData.name.trim() === '') {
            errors.push('Category name is required');
        }
        
        // Description validation
        if (categoryData.description && typeof categoryData.description !== 'string') {
            errors.push('Invalid category description');
        }
        
        // Image validation
        if (categoryData.image && typeof categoryData.image !== 'string') {
            errors.push('Invalid category image URL');
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate product data
     */
    public static validateProduct(productData: any): { valid: boolean; errors: string[] } {
        const errors: string[] = [];
        
        // Name validation
        if (!productData.name || typeof productData.name !== 'string' || productData.name.trim() === '') {
            errors.push('Product name is required');
        }
        
        // SKU validation
        if (!productData.sku || typeof productData.sku !== 'string' || productData.sku.trim() === '') {
            errors.push('Product SKU is required');
        }
        
        // Price validation
        if (typeof productData.price !== 'number' || productData.price < 0) {
            errors.push('Valid price is required');
        }
        
        // Category validation
        if (!productData.category || typeof productData.category !== 'string' || productData.category.trim() === '') {
            errors.push('Product category is required');
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate form inputs in DOM
     */
    public static validateFormInputs(requiredFields: { selector: string; message: string }[]): { valid: boolean; firstErrorElement?: HTMLElement } {
        for (const field of requiredFields) {
            const element = document.querySelector(field.selector) as HTMLInputElement | HTMLTextAreaElement;
            
            if (!element?.value?.trim()) {
                return {
                    valid: false,
                    firstErrorElement: element
                };
            }
        }
        
        return { valid: true };
    }

    /**
     * Validate product images - ensure at least one image is present
     */
    public static validateProductImages(imageHandler: any): { valid: boolean; message?: string } {
        // Get total image count (new files + existing images - removed images)
        const newImageFiles = imageHandler.getImageFiles ? imageHandler.getImageFiles().length : 0;
        const existingImages = imageHandler.getExistingImageUrls ? imageHandler.getExistingImageUrls().length : 0;
        const removedIndices = imageHandler.getRemovedImageIndices ? imageHandler.getRemovedImageIndices().length : 0;
        
        console.log('🔍 Validating product images:', {
            newImageFiles,
            existingImages,
            removedIndices
        });
        
        // Calculate total images
        const totalImages = newImageFiles + existingImages - removedIndices;
        
        if (totalImages <= 0) {
            return {
                valid: false,
                message: 'At least one product image is required. Please upload at least one image before saving.'
            };
        }
        
        return { valid: true };
    }

    /**
     * Validate product images in edit mode specifically
     */
    public static validateProductImagesEditMode(existingImages: any, removedIndices: string[], newImageFiles: File[]): { valid: boolean; message?: string } {
        // Count existing images that are not removed
        const imageSlots = ['firstImg', 'secondImg', 'thirdImg'];
        let remainingExistingImages = 0;
        
        for (const slot of imageSlots) {
            if (existingImages[slot] && !removedIndices.includes(slot)) {
                remainingExistingImages++;
            }
        }
        
        const totalImages = remainingExistingImages + newImageFiles.length;
        
        console.log('🔍 Validating edit mode images:', {
            remainingExistingImages,
            newImageFiles: newImageFiles.length,
            totalImages,
            removedIndices
        });
        
        if (totalImages <= 0) {
            return {
                valid: false,
                message: 'At least one product image is required. Please upload a new image or keep at least one existing image.'
            };
        }
        
        return { valid: true };
    }

    /**
     * Validate product images in add mode specifically
     */
    public static validateProductImagesAddMode(newImageFiles: File[]): { valid: boolean; message?: string } {
        console.log('🔍 Validating add mode images:', {
            newImageFiles: newImageFiles.length
        });
        
        if (newImageFiles.length === 0) {
            return {
                valid: false,
                message: 'At least one product image is required. Please upload at least one image before saving the product.'
            };
        }
        
        return { valid: true };
    }
}
