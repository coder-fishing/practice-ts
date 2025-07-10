// Image handler for managing image upload, preview, and removal functionality

export class ImageHandler {
    private imageFiles: File[] = [];
    private maxImages: number = 3;
    private removedImageIndices: string[] = [];
    private existingImageUrls: string[] = [];

    constructor() {
        // Initialization
    }

    // Reset all image state
    public resetImageState(): void {
        this.imageFiles = [];
        this.removedImageIndices = [];
        this.existingImageUrls = [];
        
        // Clear all file inputs
        const allInputs = document.querySelectorAll('input[type="file"]');
        allInputs.forEach(input => {
            (input as HTMLInputElement).value = '';
        });
        
        console.log('🔄 Image state reset completely');
    }

    // Get total image count (new files + existing images)
    public getTotalImageCount(): number {
        return this.imageFiles.length + this.existingImageUrls.length;
    }

    // Get image files (only new uploaded files, not existing ones)
    public getImageFiles(): File[] {
        return this.imageFiles.filter(file => !file.name.startsWith('existing-'));
    }

    // Get removed image indices for edit mode
    public getRemovedImageIndices(): string[] {
        return [...this.removedImageIndices];
    }

    // Get existing image URLs for edit mode
    public getExistingImageUrls(): string[] {
        return [...this.existingImageUrls];
    }

    // Add image files
    public addImageFiles(files: File[]): void {
        this.imageFiles.push(...files);
        
        // Clear any validation errors when images are added
    }

    // Remove image file at index
    public removeImageFile(index: number): void {
        if (index >= 0 && index < this.imageFiles.length) {
            this.imageFiles.splice(index, 1);
        }
    }

    // Clear all image files
    public clearImageFiles(): void {
        this.imageFiles = [];
    }

    // Add removed image index
    public addRemovedImageIndex(slotName: string): void {
        if (!this.removedImageIndices.includes(slotName)) {
            this.removedImageIndices.push(slotName);
            console.log(`🗑️ Added ${slotName} to removed list`);
        }
    }

    // Set existing image URLs
    public setExistingImageUrls(urls: string[]): void {
        this.existingImageUrls = urls.filter(url => !!url);
    }

    // Create image preview element
    public createSimplePreview(container: HTMLElement, imageSrc: string, index: number, isExisting: boolean, actualFileIndex?: number): void {
        if (!container) return;
        
        console.log(`🖼️ Creating simple preview at index ${index}, existing: ${isExisting}, fileIndex: ${actualFileIndex}`);
        
        // Remove any existing preview with same index to prevent duplicates
        const existingPreview = container.querySelector(`[data-image-index="${index}"]`);
        if (existingPreview) {
            existingPreview.remove();
        }
        
        // Create new preview item
        const previewItem = document.createElement('div');
        previewItem.className = 'thumbnail__preview-item';
        previewItem.setAttribute('data-image-index', index.toString());
        previewItem.setAttribute('data-is-existing', isExisting.toString());
        
        // For new uploaded files, track the actual file index
        if (!isExisting && actualFileIndex !== undefined) {
            previewItem.setAttribute('data-actual-file-index', actualFileIndex.toString());
        }
        
        // Create image element
        const img = document.createElement('img');
        img.className = 'thumbnail__preview-image';
        img.src = imageSrc;
        img.alt = `Product image ${index + 1}`;
        
        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'thumbnail__preview-remove-single';
        removeBtn.setAttribute('data-remove-index', index.toString());
        removeBtn.innerHTML = '&times;';
        removeBtn.title = 'Remove this image';
        
        // Append elements
        previewItem.appendChild(img);
        previewItem.appendChild(removeBtn);
        container.appendChild(previewItem);
        
        console.log(`✅ Created simple preview at index ${index}`);
    }

    // Remove image preview
    public removeSimpleImage(index: number, container: HTMLElement): void {
        console.log(`🗑️ Removing simple image at index ${index}`);
        
        // Find and remove the preview item
        const previewItem = container.querySelector(`[data-image-index="${index}"]`);
        if (previewItem) {
            const isExisting = previewItem.getAttribute('data-is-existing') === 'true';
            const slotName = previewItem.getAttribute('data-slot-name');
            
            // Track removed existing images
            const isEditMode = !!(window as any).currentProductData;
            if (isEditMode && isExisting && slotName) {
                this.addRemovedImageIndex(slotName);
            }
            
            // Remove from imageFiles array (for new uploaded images)
            if (!isExisting) {
                // For new uploaded images, find by actual file index
                const actualFileIndex = parseInt(previewItem.getAttribute('data-actual-file-index') || index.toString());
                
                // Remove the file at the actual index
                if (actualFileIndex >= 0 && actualFileIndex < this.imageFiles.length) {
                    this.imageFiles.splice(actualFileIndex, 1);
                    console.log(`🗑️ Removed file from imageFiles array at index ${actualFileIndex}`);
                    
                    // Update remaining actual file indices in DOM
                    this.updateFileIndicesAfterRemoval(container, actualFileIndex);
                }
            }
            
            // Remove from DOM
            previewItem.remove();
            
            // Update display indices for remaining items
            this.updateDisplayIndicesAfterRemoval(container, index);
            
            console.log(`✅ Removed image at index ${index}`);
        }
    }

    // Update file indices after removal for accurate tracking
    private updateFileIndicesAfterRemoval(container: HTMLElement, removedFileIndex: number): void {
        const allPreviews = container.querySelectorAll('.thumbnail__preview-item[data-is-existing="false"]');
        allPreviews.forEach((preview) => {
            const currentIndex = parseInt(preview.getAttribute('data-actual-file-index') || '0');
            if (currentIndex > removedFileIndex) {
                preview.setAttribute('data-actual-file-index', (currentIndex - 1).toString());
            }
        });
    }

    // Update display indices after removal to maintain sequential numbering
    private updateDisplayIndicesAfterRemoval(container: HTMLElement, removedDisplayIndex: number): void {
        const allPreviews = container.querySelectorAll('.thumbnail__preview-item');
        allPreviews.forEach((preview) => {
            const currentDisplayIndex = parseInt(preview.getAttribute('data-image-index') || '0');
            if (currentDisplayIndex > removedDisplayIndex) {
                const newIndex = currentDisplayIndex - 1;
                preview.setAttribute('data-image-index', newIndex.toString());
                
                // Update remove button data attribute
                const removeBtn = preview.querySelector('.thumbnail__preview-remove-single');
                if (removeBtn) {
                    removeBtn.setAttribute('data-remove-index', newIndex.toString());
                }
            }
        });
    }

    // Remove all images
    public removeAllImages(container: HTMLElement): void {
        console.log('🗑️ Removing all images');
        
        // Track removed existing images in edit mode
        const isEditMode = !!(window as any).currentProductData;
        if (isEditMode) {
            const allPreviews = container.querySelectorAll('.thumbnail__preview-item');
            allPreviews.forEach((preview: Element) => {
                const isExisting = preview.getAttribute('data-is-existing') === 'true';
                const slotName = preview.getAttribute('data-slot-name');
                
                if (isExisting && slotName) {
                    this.addRemovedImageIndex(slotName);
                }
            });
        }
        
        // Clear all previews
        container.innerHTML = '';
        
        // Reset imageFiles
        this.imageFiles = [];
        
        // Clear file inputs
        const allInputs = document.querySelectorAll('input[type="file"]');
        allInputs.forEach(input => {
            (input as HTMLInputElement).value = '';
        });
        
        console.log('✅ All images removed');
    }

    // Validate image upload
    public validateImageUpload(files: FileList, currentImageCount: number): { valid: boolean; message?: string; allowedFiles?: File[] } {
        if (!files || files.length === 0) {
            return { valid: false, message: 'No files selected' };
        }

        const remainingSlots = this.maxImages - currentImageCount;
        
        if (remainingSlots <= 0) {
            return { 
                valid: false, 
                message: `You can only upload a maximum of ${this.maxImages} images. Please remove some images first.` 
            };
        }

        // Convert FileList to array and limit to remaining slots
        const allowedFiles = Array.from(files).slice(0, remainingSlots);
        
        let message = undefined;
        if (allowedFiles.length < files.length) {
            message = `Only added ${allowedFiles.length} images. Maximum limit is ${this.maxImages} images.`;
        }

        return { valid: true, allowedFiles, message };
    }

    // Validate that there is at least one image (for required validation)
    public validateHasImages(): { valid: boolean; message?: string } {
        const totalImages = this.getTotalImageCount();
        
        if (totalImages === 0) {
            return {
                valid: false,
                message: 'At least one product image is required'
            };
        }
        
        return { valid: true };
    }

    // Get effective image count (considering removed images in edit mode)
    public getEffectiveImageCount(): number {
        const isEditMode = !!(window as any).currentProductData;
        
        if (isEditMode) {
            // In edit mode: new files + existing images - removed images
            const newFiles = this.imageFiles.length;
            const existingImages = this.existingImageUrls.length;
            const removedImages = this.removedImageIndices.length;
            
            return newFiles + existingImages - removedImages;
        } else {
            // In add mode: just new files
            return this.imageFiles.length;
        }
    }

}
