// Table interaction handler for edit, delete, view actions
export class TableInteractionHandler {
    private router: any;
    private deleteCallback: (id: number) => Promise<void>;
    private entityName: string;
    private isInitialized: boolean = false;
    private editClickHandler: (event: Event) => void;
    private deleteClickHandler: (event: Event) => void;
    private viewClickHandler: (event: Event) => void;

    constructor(
        router: any,
        deleteCallback: (id: number) => Promise<void>,
        entityName: string = 'item'
    ) {
        this.router = router;
        this.deleteCallback = deleteCallback;
        this.entityName = entityName;
        
        // Initialize bound handlers
        this.editClickHandler = this.createEditHandler();
        this.deleteClickHandler = this.createDeleteHandler();
        this.viewClickHandler = this.createViewHandler();
    }

    /**
     * Setup all table interaction listeners
     */
    public setupTableInteractions(): void {
        if (this.isInitialized) {
            console.log(`⚠️ ${this.entityName} table event listeners already initialized, skipping...`);
            return;
        }
        
        console.log(`🔄 Setting up ${this.entityName} table event listeners...`);
        
        this.setupEditListeners();
        this.setupDeleteListeners();
        this.setupViewListeners();
        
        this.isInitialized = true;
        console.log(`✅ ${this.entityName} table event listeners setup completed`);
    }

    /**
     * Create edit handler
     */
    private createEditHandler(): (event: Event) => void {
        return (event: Event) => {
            const editBtn = (event.target as HTMLElement).closest(`.${this.entityName}-table__edit`);
            if (editBtn) {
                const id = editBtn.getAttribute('data-id');
                if (id) {
                    console.log(`🔄 Edit ${this.entityName}:`, id);
                    this.handleEdit(id);
                }
            }
        };
    }

    /**
     * Create delete handler
     */
    private createDeleteHandler(): (event: Event) => void {
        return (event: Event) => {
            const deleteBtn = (event.target as HTMLElement).closest(`.${this.entityName}-table__delete`);
            if (deleteBtn) {
                const id = deleteBtn.getAttribute('data-id');
                if (id) {
                    console.log(`🔄 Delete ${this.entityName}:`, id);
                    this.handleDelete(id);
                }
            }
        };
    }

    /**
     * Create view handler
     */
    private createViewHandler(): (event: Event) => void {
        return (event: Event) => {
            const viewBtn = (event.target as HTMLElement).closest(`.${this.entityName}-table__view`);
            if (viewBtn) {
                const id = viewBtn.getAttribute('data-id');
                if (id) {
                    console.log(`🔄 View ${this.entityName}:`, id);
                    this.handleView(id);
                }
            }
        };
    }

    /**
     * Setup edit button listeners
     */
    private setupEditListeners(): void {
        document.addEventListener('click', this.editClickHandler);
    }

    /**
     * Setup delete button listeners
     */
    private setupDeleteListeners(): void {
        document.addEventListener('click', this.deleteClickHandler);
    }

    /**
     * Setup view button listeners
     */
    private setupViewListeners(): void {
        document.addEventListener('click', this.viewClickHandler);
    }

    /**
     * Handle edit action
     */
    private handleEdit(id: string): void {
        const editRoute = `edit${this.entityName}/${id}`;
        this.router.navigate(`/${editRoute}`);
    }

    /**
     * Handle view action
     */
    private handleView(id: string): void {
        const viewRoute = `view${this.entityName}/${id}`;
        this.router.navigate(`/${viewRoute}`);
    }

    /**
     * Handle delete action
     */
    private async handleDelete(id: string): Promise<void> {
        const confirmed = confirm(`Are you sure you want to delete this ${this.entityName}? This action cannot be undone.`);
        
        if (!confirmed) {
            return;
        }
        
        try {
            await this.deleteCallback(parseInt(id));
        } catch (error) {
            console.error(`❌ Error deleting ${this.entityName}:`, error);
            throw error;
        }
    }
}
