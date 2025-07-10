// Edit mode handler for managing existing product images in edit mode
import { ImageHandler } from './ImageHandler';

export class EditModeHandler {
    private imageHandler: ImageHandler;

    constructor(imageHandler: ImageHandler) {
        this.imageHandler = imageHandler;
    }

    // Initialize edit mode with existing images
    public initializeEditModeImages(existingImages: {firstImg?: string | null, secondImg?: string | null, thirdImg?: string | null}): void {
        console.log('🔄 Initializing edit mode images:', existingImages);
        
        // Only reset imageFiles array, not the entire state
        this.imageHandler.clearImageFiles();
        
        // Get existing images array
        const existingUrls = [existingImages.firstImg, existingImages.secondImg, existingImages.thirdImg]
            .filter(img => !!img) as string[];
        
        this.imageHandler.setExistingImageUrls(existingUrls);
            
        // Find UI elements with correct selectors
        const previewContainer = document.getElementById('previewContainer') as HTMLElement;
        const emptyState = document.getElementById('emptyState');
        const filledState = document.getElementById('filledState');
        
        console.log('📌 Edit mode UI elements:', {
            previewContainerFound: !!previewContainer,
            emptyStateFound: !!emptyState,
            filledStateFound: !!filledState,
            existingImagesCount: existingUrls.length
        });
        
        if (!previewContainer || !emptyState || !filledState) {
            console.error('❌ Cannot find required UI elements for edit mode');
            return;
        }
        
        // If no existing images, set up for empty state
        if (existingUrls.length === 0) {
            console.log('📌 No existing images, setting up empty state');
            this.updateUIState(emptyState, filledState, false);
            return;
        }
        
        // Show filled state
        this.updateUIState(emptyState, filledState, true);
        
        // Only clear if we have images to replace
        previewContainer.innerHTML = '';
        
        console.log('📌 Creating previews for existing images...');
        
        // Create previews for existing images
        const imageSlots = ['firstImg', 'secondImg', 'thirdImg'];
        let currentIndex = 0;
        
        imageSlots.forEach(slot => {
            const imageUrl = existingImages[slot as keyof typeof existingImages];
            if (imageUrl) {
                console.log(`📸 Processing ${slot} with URL: ${imageUrl.substring(0, 50)}...`);
                
                // Create preview with slot name for tracking
                this.imageHandler.createSimplePreview(previewContainer, imageUrl, currentIndex, true);
                
                // Add slot name attribute after creation
                const createdPreview = previewContainer.querySelector(`[data-image-index="${currentIndex}"]`);
                if (createdPreview) {
                    createdPreview.setAttribute('data-slot-name', slot);
                    console.log(`📸 Set slot name ${slot} for index ${currentIndex}`);
                }
                
                // Add placeholder to imageFiles to maintain count
                const placeholderFile = new File([""], `existing-${slot}.jpg`, { type: "image/jpeg" });
                this.imageHandler.addImageFiles([placeholderFile]);
                
                currentIndex++;
                console.log(`📸 Created existing preview for ${slot} at index ${currentIndex - 1}`);
            }
        });
        
        console.log('✅ Edit mode images initialized successfully');
        
        // Update counter after initialization
        this.updateImageCounter(previewContainer);
    }

    // Update image counter
    private updateImageCounter(container: HTMLElement): void {
        const imageCounter = document.querySelector('.images-counter');
        if (imageCounter) {
            const currentCount = container.querySelectorAll('.thumbnail__preview-item').length;
            imageCounter.textContent = `${currentCount}/3 images`;
            console.log(`📊 Updated counter: ${currentCount}/3 images`);
        }
    }

    // Clear all images including existing previews
    public clearAllImagesIncludingPreviews(
        imageInput: HTMLInputElement | null, 
        previewContainer: HTMLElement | null,
        emptyState: HTMLElement | null,
        previewState: HTMLElement | null
    ): void {
        console.log('🗑️ Clearing all images including existing previews');
        
        // In edit mode, mark all existing images as removed
        const isEditMode = !!(window as any).currentProductData;
        if (isEditMode && previewContainer) {
            const allPreviews = previewContainer.querySelectorAll('.thumbnail__preview-item');
            allPreviews.forEach((preview: Element) => {
                const isExisting = preview.getAttribute('data-is-existing') === 'true';
                const slotName = preview.getAttribute('data-slot-name');
                
                if (isExisting && slotName) {
                    this.imageHandler.addRemovedImageIndex(slotName);
                }
            });
        }
        
        // Reset image files array
        this.imageHandler.clearImageFiles();
        
        // Clear all file inputs
        const allInputs = document.querySelectorAll('input[type="file"]');
        allInputs.forEach(input => {
            (input as HTMLInputElement).value = '';
        });
        
        // Clear specific file input if provided
        if (imageInput) {
            imageInput.value = '';
        }
        
        // Clear preview container
        if (previewContainer) {
            previewContainer.innerHTML = '';
        }
        
        // Update UI state to show empty state
        this.updateUIState(emptyState, previewState, false);   
    }
    
    // Remove single image including existing previews
    public removeSingleImageIncludingPreview(
        index: number,
        previewContainer: HTMLElement | null,
        emptyState: HTMLElement | null,
        previewState: HTMLElement | null
    ): void {
        console.log(`🗑️ Removing image at index ${index}`);
        
        if (!previewContainer) {
            console.error('❌ Preview container not found');
            return;
        }
        
        // Find the specific preview item to remove
        const previewItem = previewContainer.querySelector(`[data-image-index="${index}"]`) as HTMLElement;
        if (!previewItem) {
            console.error(`❌ No preview item found with index ${index}`);
            return;
        }
        
        // Get the slot name directly from the element if available (for existing images)
        const slotName = previewItem.getAttribute('data-slot-name');
        
        // Check if we're in edit mode
        const isEditMode = !!(window as any).currentProductData;
        
        if (isEditMode) {
            // If we have a slot name from the element, use it
            if (slotName) {
                this.imageHandler.addRemovedImageIndex(slotName);
            } else {
                // Otherwise map index to a slot name
                const imageKeys = ['firstImg', 'secondImg', 'thirdImg'];
                if (index < imageKeys.length) {
                    const mappedSlotName = imageKeys[index];
                    this.imageHandler.addRemovedImageIndex(mappedSlotName);
                }
            }
        }
        
        // Remove the element from the DOM first
        previewItem.remove();
        
        // Remove from imageFiles array
        if (index < this.imageHandler.getImageFiles().length) {
            this.imageHandler.removeImageFile(index);
        }
        
        // Re-index remaining preview items to maintain consistency
        this.reindexPreviewItems(previewContainer);
        
        // Update counter
        const totalImages = previewContainer.querySelectorAll('.thumbnail__preview-item').length;
        console.log(`📊 Remaining images: ${totalImages}`);
        
        // If no images left, show empty state
        if (totalImages === 0 && emptyState && previewState) {
            this.updateUIState(emptyState, previewState, false);
            
            // Reset file inputs
            const allInputs = document.querySelectorAll('input[type="file"]');
            allInputs.forEach(input => {
                (input as HTMLInputElement).value = '';
            });
        }
    }

    // Helper method to update UI state
    private updateUIState(
        emptyState: HTMLElement | null,
        previewState: HTMLElement | null,
        show: boolean
    ): void {
        if (emptyState && previewState) {
            emptyState.style.display = show ? 'none' : 'flex';
            previewState.style.display = show ? 'block' : 'none';
        }
    }

    // Helper method to re-index preview items
    private reindexPreviewItems(container: HTMLElement): void {
        const allItems = container.querySelectorAll('.thumbnail__preview-item');
        allItems.forEach((item, newIndex) => {
            item.setAttribute('data-image-index', newIndex.toString());
            
            const removeBtn = item.querySelector('.thumbnail__preview-remove-single');
            if (removeBtn) {
                removeBtn.setAttribute('data-remove-index', newIndex.toString());
            }
        });
    }
}
