// Main ProductUIHandler - Refactored and simplified using composition pattern
import { ImageHandler } from './handlers/ImageHandler';
import { EventHandler } from './handlers/EventHandler';
import { DropdownHandler } from './handlers/DropdownHandler';
import { EditModeHandler } from './handlers/EditModeHandler';
import { UIUtils } from './handlers/UIUtils';
import { createToast } from '~/utils/toast';

class ProductUIHandler {
    private imageHandler: ImageHandler;
    private eventHandler: EventHandler;
    private dropdownHandler: DropdownHandler;
    private editModeHandler: EditModeHandler;
    private isEventListenersSetup: boolean = false;

    constructor() {
        this.imageHandler = new ImageHandler();
        this.eventHandler = new EventHandler(this.imageHandler);
        this.dropdownHandler = new DropdownHandler();
        this.editModeHandler = new EditModeHandler(this.imageHandler);
    }

    // Main cleanup method
    public cleanup(): void {
        console.log('🧹 Cleaning up ProductUIHandler...');
        
        // Clean up all event listeners
        this.eventHandler.cleanup();
        
        // Reset all image state
        this.imageHandler.resetImageState();
        
        // Clear window state
        if ((window as any).currentProductData) {
            delete (window as any).currentProductData;
        }
        
        // Reset setup flags
        this.isEventListenersSetup = false;
        
        // Clear all preview containers (with edit mode protection)
        this.clearAllPreviewContainers();
        
        console.log('✅ ProductUIHandler cleanup completed');
    }

    // Clear all preview containers to prevent state leakage
    private clearAllPreviewContainers(force = false): void {
        // Don't clear if we're in edit mode and not forcing
        const isEditMode = !!(window as any).currentProductData;
        if (isEditMode && !force) {
            console.log('⚠️ Skipping preview container clear in edit mode');
            return;
        }
        
        const previewContainers = document.querySelectorAll('.thumbnail__preview-container');
        previewContainers.forEach(container => {
            container.innerHTML = '';
        });
        
        // Reset UI states
        const emptyStates = document.querySelectorAll('.thumbnail__empty-state');
        const previewStates = document.querySelectorAll('.thumbnail__preview-state');
        
        emptyStates.forEach(state => {
            if (state instanceof HTMLElement) {
                state.style.display = 'flex';
            }
        });
        
        previewStates.forEach(state => {
            if (state instanceof HTMLElement) {
                state.style.display = 'none';
            }
        });
    }

    // Main setup method for multiple images handling
    public setupMultipleImagesHandling(elements: any): void {
        const { 
            emptyState, 
            previewState, 
            imageInput, 
            previewContainer, 
            uploadArea 
        } = elements;
        
        console.log('🔧 Setting up multiple images handling');
        
        // Always cleanup first to prevent conflicts
        if (this.isEventListenersSetup) {
            console.log('⚠️ Event listeners already set up, cleaning up first');
            this.eventHandler.cleanup();
            this.isEventListenersSetup = false;
        }
        
        // Reset image state completely
        this.imageHandler.resetImageState();
        
        // Clear preview container
        if (previewContainer) {
            previewContainer.innerHTML = '';
        }

        // Setup file inputs for multiple selection
        this.setupFileInputs(imageInput, previewContainer, emptyState, previewState);

        // Setup event listeners
        this.eventHandler.setupImageEventListeners(previewContainer);
        this.isEventListenersSetup = true;

        // Setup drag and drop
        if (uploadArea) {
            const handleImagesUpload = this.createImageUploadHandler(previewContainer, emptyState, previewState);
            this.eventHandler.setupMultipleDragAndDrop(uploadArea, handleImagesUpload);
        }
        
        console.log('✅ Multiple images handling setup complete');
    }

    // Setup file inputs for multiple selection
    private setupFileInputs(imageInput: HTMLInputElement, previewContainer: HTMLElement, emptyState: HTMLElement, previewState: HTMLElement): void {
        const emptyInput = document.getElementById('imageInputEmpty') as HTMLInputElement;
        const filledInput = document.getElementById('imageInputFilled') as HTMLInputElement;
        
        // Create upload handler once
        const handleImagesUpload = this.createImageUploadHandler(previewContainer, emptyState, previewState);
        
        // Set up all available inputs
        [emptyInput, filledInput, imageInput].forEach(input => {
            if (input) {
                // Remove existing event listeners first
                const newInput = input.cloneNode(true) as HTMLInputElement;
                input.parentNode?.replaceChild(newInput, input);
                
                // Setup fresh input
                newInput.setAttribute('multiple', 'true');
                newInput.value = '';
                
                // Add change event listener
                newInput.addEventListener('change', (e: Event) => {
                    console.log('📁 File input changed');
                    const files = (e.target as HTMLInputElement).files;
                    if (files && files.length > 0) {
                        handleImagesUpload(files);
                    }
                });
            }
        });
    }

    // Create image upload handler
    private createImageUploadHandler(previewContainer: HTMLElement, emptyState: HTMLElement, previewState: HTMLElement) {
        return async (files: FileList) => {
            if (!files || files.length === 0) return;
            
            try {
                console.log(`📸 Handling ${files.length} new images`);
                
                // Validate upload - count all images including existing ones
                const totalCurrentImages = previewContainer.querySelectorAll('.thumbnail__preview-item').length;
                const validation = this.imageHandler.validateImageUpload(files, totalCurrentImages);
                
                if (!validation.valid) {
                    createToast(validation.message || 'Upload validation failed', 'info');
                    return;
                }

                const newFiles = validation.allowedFiles!;
                
                if (validation.message) {
                    createToast(validation.message, 'info');
                }
                
                // Add to imageFiles array
                this.imageHandler.addImageFiles(newFiles);
                
                // Clear all file inputs
                UIUtils.clearAllFileInputs();
                
                // Get starting index before creating any previews
                const startingIndex = previewContainer.querySelectorAll('.thumbnail__preview-item').length;
                
                // Create preview for each new image
                newFiles.forEach((file, fileIndex) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const result = e.target?.result as string;
                        const displayIndex = startingIndex + fileIndex;
                        const actualFileIndex = this.imageHandler.getImageFiles().length - newFiles.length + fileIndex;
                        
                        console.log(`📸 Creating preview for file ${fileIndex} at display index ${displayIndex}, actual file index ${actualFileIndex}`);
                        
                        this.imageHandler.createSimplePreview(previewContainer, result, displayIndex, false, actualFileIndex);
                        
                        // Update counter after each image is added
                        UIUtils.updateImageCounter(previewContainer);
                    };
                    reader.readAsDataURL(file);
                });
                
                // Update UI state
                UIUtils.updateUIState(emptyState, previewState, true);
                
                console.log('✅ Images uploaded successfully');
                
            } catch (error) {
                console.error('❌ Error handling images:', error);
                createToast('Error handling images. Please try again.', 'error');
            }
        };
    }

    // Single image handling for compatibility
    public setupImageHandling(elements: any): void {
        const { 
            emptyState, 
            previewState, 
            imageInput, 
            previewImage, 
            uploadArea 
        } = elements;

        const handleImageUpload = async (file: File) => {
            if (!file) return;

            try {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (previewImage) {
                        previewImage.src = (e.target?.result as string) || '';
                    }
                };
                reader.readAsDataURL(file);

                UIUtils.updateUIState(emptyState, previewState, true);
            } catch (error) {
                console.error('Error handling image:', error);
                createToast('Error handling image. Please try again.', 'error');
            }
        };

        // Setup click on Add Image button
        const addImageBtn = document.querySelector('.thumbnail__add-btn');
        if (addImageBtn && imageInput) {
            addImageBtn.addEventListener('click', () => {
                imageInput.click();
            });
        }

        // Setup drag and drop
        if (uploadArea) {
            this.eventHandler.setupDragAndDrop(uploadArea, handleImageUpload);
        }

        // Setup file input change
        if (imageInput) {
            imageInput.addEventListener('change', (e: Event) => {
                const files = (e.target as HTMLInputElement).files;
                const file = files?.[0];
                if (file) {
                    handleImageUpload(file);
                }
            });
        }

        // Setup remove image button
        const removeButton = document.querySelector('.thumbnail__preview-remove');
        if (removeButton) {
            removeButton.addEventListener('click', () => {
                if (imageInput) {
                    imageInput.value = '';
                }
                if (previewImage) {
                    previewImage.src = '';
                }
                UIUtils.updateUIState(emptyState, previewState, false);
            });
        }
    }

    // Reset everything for Add mode (complete fresh start)
    public resetForAddMode(): void {
        console.log('🔄 Resetting for Add mode...');
        
        // Cleanup everything
        this.eventHandler.cleanup();
        this.imageHandler.resetImageState();
        
        // Clear window state
        if ((window as any).currentProductData) {
            delete (window as any).currentProductData;
        }
        
        // Reset setup flags
        this.isEventListenersSetup = false;
        
        // Force clear all preview containers for Add mode
        this.clearAllPreviewContainers(true);
        
        // Clear all form inputs
        const form = document.querySelector('form');
        if (form) {
            form.reset();
        }
        
        // Reset specific UI states
        UIUtils.updateUIState(
            document.querySelector('.thumbnail__empty-state') as HTMLElement,
            document.querySelector('.thumbnail__preview-state') as HTMLElement,
            false
        );
        
        console.log('✅ Add mode reset completed');
    }

    // Reset everything for Edit mode (prepare for existing data)
    public resetForEditMode(): void {
        console.log('🔄 Resetting for Edit mode...');
        
        // Only cleanup event listeners, don't clear preview containers yet
        this.eventHandler.cleanup();
        
        // Reset image state but preserve window.currentProductData
        this.imageHandler.resetImageState();
        
        // Reset setup flags
        this.isEventListenersSetup = false;
        
        // Don't call full cleanup() as it will clear preview containers
        // The EditModeHandler will manage preview containers properly
        
        console.log('✅ Edit mode reset completed');
    }

    // Setup for Edit mode specifically
    public setupForEditMode(elements: any): void {
        const { 
            emptyState, 
            previewState, 
            imageInput, 
            previewContainer, 
            uploadArea 
        } = elements;
        
        console.log('🔧 Setting up for Edit mode...');
        
        // Don't reset image state or clear containers for edit mode
        // Just setup event listeners
        this.eventHandler.setupImageEventListeners(previewContainer);
        this.isEventListenersSetup = true;

        // Setup drag and drop for new images
        if (uploadArea) {
            const handleImagesUpload = this.createImageUploadHandler(previewContainer, emptyState, previewState);
            this.eventHandler.setupMultipleDragAndDrop(uploadArea, handleImagesUpload);
        }
        
        // Setup file inputs for adding more images
        this.setupFileInputsForEdit(imageInput, previewContainer, emptyState, previewState);
        
        console.log('✅ Edit mode setup complete');
    }

    // Setup file inputs for edit mode (without resetting existing state)
    private setupFileInputsForEdit(imageInput: HTMLInputElement, previewContainer: HTMLElement, emptyState: HTMLElement, previewState: HTMLElement): void {
        const emptyInput = document.getElementById('imageInputEmpty') as HTMLInputElement;
        const filledInput = document.getElementById('imageInputFilled') as HTMLInputElement;
        
        // Create upload handler once
        const handleImagesUpload = this.createImageUploadHandler(previewContainer, emptyState, previewState);
        
        // Set up all available inputs without cloning (to preserve edit state)
        [emptyInput, filledInput, imageInput].forEach(input => {
            if (input) {
                // Enable multiple selection
                input.setAttribute('multiple', 'true');
                
                // Remove existing listeners first
                const newInput = input.cloneNode(true) as HTMLInputElement;
                input.parentNode?.replaceChild(newInput, input);
                
                // Add change event listener
                newInput.addEventListener('change', (e: Event) => {
                    console.log('📁 File input changed in edit mode');
                    const files = (e.target as HTMLInputElement).files;
                    if (files && files.length > 0) {
                        handleImagesUpload(files);
                    }
                });
            }
        });
    }

    // Delegate methods to appropriate handlers
    public getImageFiles(): File[] {
        return this.imageHandler.getImageFiles();
    }

    public getRemovedImageIndices(): string[] {
        return this.imageHandler.getRemovedImageIndices();
    }

    public getExistingImageUrls(): string[] {
        return this.imageHandler.getExistingImageUrls();
    }

    public initializeEditModeImages(existingImages: {firstImg?: string | null, secondImg?: string | null, thirdImg?: string | null}): void {
        this.editModeHandler.initializeEditModeImages(existingImages);
    }

    public loadCategories(): Promise<void> {
        return this.dropdownHandler.loadCategories();
    }

    public setupStatusDropdownItems(): void {
        this.dropdownHandler.setupStatusDropdownItems();
    }

    public resetImageState(): void {
        this.imageHandler.resetImageState();
    }

    public resetEventListeners(): void {
        this.isEventListenersSetup = false;
        this.imageHandler.resetImageState();
    }

    // Legacy methods for compatibility
    public clearAllImagesIncludingPreviews(
        imageInput: HTMLInputElement | null, 
        previewContainer: HTMLElement | null,
        emptyState: HTMLElement | null,
        previewState: HTMLElement | null
    ): void {
        this.editModeHandler.clearAllImagesIncludingPreviews(imageInput, previewContainer, emptyState, previewState);
    }

    public removeSingleImageIncludingPreview(
        index: number,
        previewContainer: HTMLElement | null,
        emptyState: HTMLElement | null,
        previewState: HTMLElement | null
    ): void {
        this.editModeHandler.removeSingleImageIncludingPreview(index, previewContainer, emptyState, previewState);
    }

    // Utility method
    public updateUIState(
        emptyState: HTMLElement | null,
        previewState: HTMLElement | null,
        show: boolean
    ): void {
        UIUtils.updateUIState(emptyState, previewState, show);
    }
}

export default ProductUIHandler;
