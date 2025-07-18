import { URLStateManager } from './URLStateManager';

export interface DropdownConfig {
    dropdownId: string;
    paramName: string;
    defaultValue?: string;
    callback?: (value: string) => void;
}

export class DropdownEventHandler {
    private static instance: DropdownEventHandler;
    private isInitialized = false;
    private urlManager: URLStateManager;
    private dropdownConfigs: Map<string, DropdownConfig> = new Map();

    public static getInstance(): DropdownEventHandler {
        if (!DropdownEventHandler.instance) {
            DropdownEventHandler.instance = new DropdownEventHandler();
        }
        return DropdownEventHandler.instance;
    }

    private constructor() {
        this.urlManager = URLStateManager.getInstance();
    }

    public registerDropdown(config: DropdownConfig): void {
        this.dropdownConfigs.set(config.dropdownId, config);
    }

    public initialize(): void {
        if (this.isInitialized) return;

        // Event delegation for all dropdowns
        document.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            const action = target.getAttribute('data-action');

            switch (action) {
                case 'toggle-dropdown':
                    this.handleToggleDropdown(target, e);
                    break;
                case 'select-option':
                    this.handleSelectOption(target);
                    break;
            }
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.dropdown')) {
                this.closeAllDropdowns();
            }
        });

        this.isInitialized = true;
    }

    private handleToggleDropdown(target: HTMLElement, event: Event): void {
        event.stopPropagation();
        
        const targetId = target.getAttribute('data-target');
        const content = document.getElementById(targetId || '');
        
        if (content) {
            // Close other dropdowns first
            this.closeAllDropdowns();
            
            // Toggle current dropdown
            const isVisible = content.style.display === 'block';
            content.style.display = isVisible ? 'none' : 'block';
        }
    }

    private handleSelectOption(target: HTMLElement): void {
        const value = target.getAttribute('data-value');
        const dropdown = target.closest('.dropdown');
        const dropbtn = dropdown?.querySelector('.dropbtn');
        const content = dropdown?.querySelector('.dropdown-content') as HTMLElement;
        const dropdownId = dropdown?.id;

        if (dropbtn && value) {
            dropbtn.textContent = target.textContent;
            dropbtn.setAttribute('data-selected-value', value);
        }

        if (content) {
            content.style.display = 'none';
        }

        // Update URL based on dropdown config
        if (dropdownId && value) {
            const config = this.dropdownConfigs.get(dropdownId);
            if (config) {
                if (value === config.defaultValue || value === '') {
                    this.urlManager.deleteParam(config.paramName);
                } else {
                    this.urlManager.setParam(config.paramName, value);
                }

                // Call custom callback if provided
                if (config.callback) {
                    config.callback(value);
                }
            }
        }

        // Dispatch custom event for controller to handle
        const event = new CustomEvent('dropdown-change', {
            detail: {
                dropdownId,
                value,
                label: target.textContent
            }
        });
        document.dispatchEvent(event);
    }

    private closeAllDropdowns(): void {
        const dropdowns = document.querySelectorAll('.dropdown-content');
        dropdowns.forEach(dropdown => {
            (dropdown as HTMLElement).style.display = 'none';
        });
    }

    public cleanup(): void {
        this.isInitialized = false;
    }

    // Initialize dropdowns from current URL parameters
    public initializeFromURL(): void {
        const currentState = this.urlManager.getCurrentState();
        this.updateDropdownsFromState(currentState);
    }

    // Update dropdown displays based on URL state
    private updateDropdownsFromState(state: any): void {
        this.dropdownConfigs.forEach((config, dropdownId) => {
            const dropdown = document.getElementById(dropdownId);
            if (dropdown) {
                const value = state[config.paramName] || config.defaultValue || '';
                this.updateDropdownDisplay(dropdown, value);
            }
        });
    }

    // Update single dropdown display
    private updateDropdownDisplay(dropdown: HTMLElement, selectedValue: string): void {
        const dropbtn = dropdown.querySelector('.dropbtn');
        const selectedOption = dropdown.querySelector(`[data-value="${selectedValue}"]`);
        
        if (dropbtn && selectedOption) {
            dropbtn.textContent = selectedOption.textContent;
            dropbtn.setAttribute('data-selected-value', selectedValue);
        }
    }

    // Listen for URL changes and update dropdowns accordingly
    public listenForURLChanges(): void {
        this.urlManager.onStateChange((state) => {
            this.updateDropdownsFromState(state);
        });
    }
}