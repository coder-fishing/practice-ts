// Event handler for managing click events and user interactions
import { ImageHandler } from './ImageHandler';

export class EventHandler {
    private imageHandler: ImageHandler;
    private clickHandler: ((e: Event) => void) | null = null;
    private isEventListenersSetup: boolean = false;

    constructor(imageHandler: ImageHandler) {
        this.imageHandler = imageHandler;
    }

    // Setup image event listeners with event delegation
    public setupImageEventListeners(previewContainer: HTMLElement): void {
        // Remove existing event listener if any
        if (this.clickHandler) {
            document.removeEventListener('click', this.clickHandler);
        }
        
        // Create new click handler
        this.clickHandler = (e: Event) => {
            const target = e.target as HTMLElement;
            
            // Handle add image buttons
            if (target.closest('.media__upload-btn:not(.remove-all-images)') || 
                target.closest('.thumbnail__add-btn')) {
                e.preventDefault();
                
                console.log('🖼️ Add images button clicked');
                
                // Find appropriate file input based on the current state
                let fileInput: HTMLInputElement | null = null;
                
                const filledInput = document.getElementById('imageInputFilled') as HTMLInputElement;
                const emptyInput = document.getElementById('imageInputEmpty') as HTMLInputElement;
                
                // Check which state is currently visible
                const filledState = document.getElementById('filledState');
                const emptyState = document.getElementById('emptyState');
                
                if (filledState && filledState.style.display !== 'none' && filledInput) {
                    fileInput = filledInput;
                    console.log('📁 Using filled state input');
                    
                } else if (emptyState && emptyState.style.display !== 'none' && emptyInput) {
                    fileInput = emptyInput;
                    console.log('📁 Using empty state input');
                    
                } else {
                    // Fallback: try any available input
                    fileInput = filledInput || emptyInput;
                    console.log('📁 Using fallback input');
                }
                
                if (fileInput) {
                    fileInput.click();
                } else {
                    console.error('❌ No file input found');
                }
            }
            
            // Handle remove all button
            if (target.closest('.remove-all-images')) {
                e.preventDefault();
                
                console.log('🗑️ Remove all images button clicked');
                this.imageHandler.removeAllImages(previewContainer);
                this.updateImageCounter(previewContainer);
                this.checkEmptyState(previewContainer);
            }
            
            // Handle remove single image button
            if (target.closest('.thumbnail__preview-remove-single')) {
                e.preventDefault();
                
                console.log('🗑️ Remove single image button clicked');
                const removeBtn = target.closest('.thumbnail__preview-remove-single') as HTMLElement;
                const removeIndex = parseInt(removeBtn.getAttribute('data-remove-index') || '0', 10);
                
                this.imageHandler.removeSimpleImage(removeIndex, previewContainer);
                this.reindexPreviewItems(previewContainer);
                this.updateImageCounter(previewContainer);
                this.checkEmptyState(previewContainer);
            }
        };
        
        // Add the new event listener
        document.addEventListener('click', this.clickHandler);
        this.isEventListenersSetup = true;
        console.log('✅ Image event listeners setup completed');
    }

    // Setup drag and drop functionality
    public setupMultipleDragAndDrop(dropArea: HTMLElement, handleFiles: (files: FileList) => void): void {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => {
                dropArea.classList.add('highlight');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => {
                dropArea.classList.remove('highlight');
            }, false);
        });

        dropArea.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            if (dt?.files) {
                handleFiles(dt.files);
            }
        }, false);
    }

    // Setup traditional drag and drop for single file
    public setupDragAndDrop(dropArea: HTMLElement, handleFile: (file: File) => void): void {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => {
                dropArea.classList.add('highlight');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => {
                dropArea.classList.remove('highlight');
            }, false);
        });

        dropArea.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            if (dt?.files && dt.files[0]) {
                handleFile(dt.files[0]);
            }
        }, false);
    }

    // Cleanup event listeners
    public cleanup(): void {
        if (this.clickHandler) {
            document.removeEventListener('click', this.clickHandler);
            this.clickHandler = null;
        }
        this.isEventListenersSetup = false;
        console.log('✅ EventHandler cleanup completed');
    }

    // Check if event listeners are already setup
    public isSetup(): boolean {
        return this.isEventListenersSetup;
    }

    // Helper method to update image counter
    private updateImageCounter(container: HTMLElement): void {
        const imageCounter = document.querySelector('.images-counter');
        if (imageCounter) {
            const currentCount = container.querySelectorAll('.thumbnail__preview-item').length;
            imageCounter.textContent = `${currentCount}/3 images`;
        }
    }

    // Helper method to check if should switch to empty state
    private checkEmptyState(container: HTMLElement): void {
        const totalImages = container.querySelectorAll('.thumbnail__preview-item').length;
        const emptyState = document.getElementById('emptyState');
        const filledState = document.getElementById('filledState');
        
        if (totalImages === 0 && emptyState && filledState) {
            emptyState.style.display = 'flex';
            filledState.style.display = 'none';
            
            // Reset file inputs
            const allInputs = document.querySelectorAll('input[type="file"]');
            allInputs.forEach(input => {
                (input as HTMLInputElement).value = '';
            });
            
            console.log('🔄 Switched to empty state');
        }
    }

    // Helper method to re-index preview items after removal
    private reindexPreviewItems(container: HTMLElement): void {
        const allItems = container.querySelectorAll('.thumbnail__preview-item');
        let newFileIndex = 0;
        
        allItems.forEach((item, displayIndex) => {
            const isExisting = item.getAttribute('data-is-existing') === 'true';
            
            item.setAttribute('data-image-index', displayIndex.toString());
            
            if (!isExisting) {
                item.setAttribute('data-actual-file-index', newFileIndex.toString());
                newFileIndex++;
            }
            
            const removeBtn = item.querySelector('.thumbnail__preview-remove-single');
            if (removeBtn) {
                removeBtn.setAttribute('data-remove-index', displayIndex.toString());
            }
        });
        
        console.log(`🔄 Re-indexed ${allItems.length} preview items, ${newFileIndex} new files`);
    }
}
