interface DropdownElements {
    container: HTMLElement;
    button: HTMLElement;
    content: HTMLElement;
    statusText: HTMLElement | null;
}

export const dropdown = (
    id: string, 
    btn: string, 
    content: string, 
    text: string | null = null
): DropdownElements | undefined => {
    
    
    const dropdown = document.getElementById(id);
    const dropdownButton = document.getElementById(btn);
    const dropdownContent = document.getElementById(content);
    const statusText = text ? document.getElementById(text) : null;

    // Check if elements exist
    if (!dropdown) {
        console.error(`Dropdown container #${id} not found`);
        return;
    }
    if (!dropdownButton) {
        console.error(`Dropdown button #${btn} not found`);
        return;
    }
    if (!dropdownContent) {
        console.error(`Dropdown content #${content} not found`);
        return;
    }

    // Apply important initial styles directly
    dropdownContent.style.cssText = "display: none; position: absolute; z-index: 1000;";
    
    // Make the button trigger the dropdown - use a direct onclick assignment that won't interfere with any 
    // other onclick handlers
    if (!(dropdownButton as any).hasDropdownHandler) {
        (dropdownButton as any).hasDropdownHandler = true;
        
        // Save any existing onclick handler
        const existingHandler = dropdownButton.onclick;
        
        dropdownButton.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            
            
            // First close all other dropdowns
            document.querySelectorAll('.dropdown-content').forEach(dc => {
                if (dc.id !== dropdownContent.id) {
                    (dc as HTMLElement).style.display = 'none';
                }
            });
            
            // Then toggle the current dropdown
            dropdownContent.style.display = 
                dropdownContent.style.display === 'none' ? 'block' : 'none';
            
            // Call existing handler if it exists
            if (existingHandler && typeof existingHandler === 'function') {
                existingHandler.call(this, e);
            }
        };
    }

    // Make each item in the dropdown selectable with direct onclick assignments
    const items = dropdownContent.querySelectorAll('div');
    items.forEach(item => {
        if (!(item as any).hasDropdownItemHandler) {
            (item as any).hasDropdownItemHandler = true;
            
            // Save any existing onclick handler
            const existingHandler = item.onclick;
            
            // Add new handler
            item.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const selectedValue = item.getAttribute('data-value') || item.textContent;
                const selectedId = item.getAttribute('data-id');
                
                
                
                // Update the button text
            dropdownButton.textContent = selectedValue;
            
                // Store selected ID if available
            if (selectedId) {
                dropdownButton.setAttribute('data-selected-id', selectedId);
                    
                } else {
                    dropdownButton.removeAttribute('data-selected-id');
            }

                // Update status text if available
            if (statusText) {
                statusText.textContent = selectedValue;

                if(selectedValue !== null) {                  
                    // Update status class
                    const statusClass = selectedValue.toLowerCase().replace(/\s+/g, '-');
                    statusText.className = `form-section__title-status--label-text ${statusClass}`;
                }
                    
            }

                // Hide the dropdown after selection
            dropdownContent.style.display = 'none';
                
                // Call existing handler if it exists
                if (existingHandler && typeof existingHandler === 'function') {
                    existingHandler.call(this, e);
                }
            };
        }
    });

    // Close dropdown when clicking outside - add only once per dropdown
    const clickOutsideHandler = function(e: MouseEvent) {
        if (!dropdown.contains(e.target as Node)) {
            dropdownContent.style.display = 'none';
        }
    };
    
    // Remove any existing handlers first
    document.removeEventListener('click', clickOutsideHandler);
    document.addEventListener('click', clickOutsideHandler);
    
    // Return the dropdown elements for further customization
    return {
        container: dropdown,
        button: dropdownButton,
        content: dropdownContent,
        statusText: statusText
    };
};