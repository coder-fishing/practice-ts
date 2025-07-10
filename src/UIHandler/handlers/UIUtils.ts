// UI utility functions for common UI operations
export class UIUtils {
    
    // Update image counter display
    static updateImageCounter(container: HTMLElement): void {
        const imageCounter = document.querySelector('.images-counter');
        if (imageCounter) {
            const currentCount = container.querySelectorAll('.thumbnail__preview-item').length;
            imageCounter.textContent = `${currentCount}/3 images`;
        }
    }

    // Check if should switch to empty state
    static checkEmptyState(container: HTMLElement): void {
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

    // Re-index preview items after removal
    static reindexPreviewItems(container: HTMLElement): void {
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

    // Update UI state between empty and filled states
    static updateUIState(
        emptyState: HTMLElement | null,
        previewState: HTMLElement | null,
        show: boolean
    ): void {
        if (emptyState && previewState) {
            emptyState.style.display = show ? 'none' : 'flex';
            previewState.style.display = show ? 'block' : 'none';
        }
    }

    // Clear all file inputs
    static clearAllFileInputs(): void {
        const allInputs = document.querySelectorAll('input[type="file"]');
        allInputs.forEach(input => {
            (input as HTMLInputElement).value = '';
        });
    }

}
