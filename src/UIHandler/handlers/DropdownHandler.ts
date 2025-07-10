// Dropdown handler for managing category and status dropdowns
import CategoryController from "~/controllers/CategoryController";

export class DropdownHandler {
    
    // Setup status dropdown functionality
    public setupStatusDropdownItems(): void {
        const dropdownContent = document.getElementById('dropdownContent');
        const dropdownButton = document.getElementById('dropdownButton');
        const statusText = document.getElementById('status-text');
        
        if (!dropdownContent || !dropdownButton || !statusText) {
            console.error('Status dropdown elements not found:', {
                content: !!dropdownContent,
                button: !!dropdownButton,
                statusText: !!statusText
            });
            return;
        }
        
        // Get all status items
        const statusItems = dropdownContent.querySelectorAll('div');
        statusItems.forEach(item => {
            // Add direct onclick handler
            item.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const value = item.getAttribute('data-value');
                
                if (!value) return;
                
                // Update dropdown button
                dropdownButton.textContent = value;
                
                // Update status text and class
                statusText.textContent = value;
                const statusClass = value.toLowerCase().replace(/\s+/g, '-');
                statusText.className = `form-section__title-status--label-text ${statusClass}`;
                
                // Hide dropdown
                dropdownContent.style.display = 'none';
            };
        });
        
        console.log('✅ Status dropdown setup completed');
    }

    // Load and setup category dropdown
    public async loadCategories(): Promise<void> {
        try {
            const categories = await CategoryController.getInstance().getAllCategories();
            const dropdownContent = document.getElementById('dropdownContentTop');
            const dropdownButton = document.getElementById('dropdownButtonTop');
            
            if (!dropdownContent || !dropdownButton) {
                console.error('Category dropdown elements not found:', {
                    content: !!dropdownContent,
                    button: !!dropdownButton
                });
                return;
            }
            
            // Clear any existing hardcoded categories
            dropdownContent.innerHTML = '';
            
            // Add categories from the API
            if (categories && categories.length > 0) {
                // Add each category as a dropdown item
                categories.forEach(category => {
                    const item = document.createElement('div');
                    item.setAttribute('data-value', category.name);
                    item.setAttribute('data-id', category.categoryID || '');
                    item.textContent = category.name;
                    
                    // Add direct click handler
                    item.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Update dropdown button
                        dropdownButton.textContent = category.name;
                        dropdownButton.setAttribute('data-selected-id', category.categoryID || '');
                        
                        // Hide dropdown
                        dropdownContent.style.display = 'none';
                    };
                    
                    // Add to dropdown content
                    dropdownContent.appendChild(item);
                });
                
                console.log(`✅ Loaded ${categories.length} categories`);
            } else {
                console.warn('No categories returned from API');
                // Add a default "None" option
                const noneItem = document.createElement('div');
                noneItem.setAttribute('data-value', 'None');
                noneItem.textContent = 'None';
                dropdownContent.appendChild(noneItem);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    // Setup generic dropdown functionality
    public setupDropdown(dropdownId: string, contentId: string, onSelect?: (value: string, id?: string) => void): void {
        const dropdown = document.getElementById(dropdownId);
        const content = document.getElementById(contentId);
        
        if (!dropdown || !content) {
            console.error(`Dropdown elements not found: ${dropdownId}, ${contentId}`);
            return;
        }

        // Toggle dropdown on button click
        dropdown.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isVisible = content.style.display === 'block';
            content.style.display = isVisible ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target as Node)) {
                content.style.display = 'none';
            }
        });

        // Handle item selection
        if (onSelect) {
            content.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                if (target.tagName === 'DIV') {
                    const value = target.getAttribute('data-value');
                    const id = target.getAttribute('data-id');
                    
                    if (value) {
                        onSelect(value, id || undefined);
                        content.style.display = 'none';
                    }
                }
            });
        }
    }
}
