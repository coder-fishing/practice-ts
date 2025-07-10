// Table interaction handler for edit, delete, view actions
export class TableInteractionHandler {
    private router: any;
    private deleteCallback: (id: number) => Promise<void>;
    private entityName: string;

    constructor(
        router: any,
        deleteCallback: (id: number) => Promise<void>,
        entityName: string = 'item'
    ) {
        this.router = router;
        this.deleteCallback = deleteCallback;
        this.entityName = entityName;
    }

    /**
     * Setup all table interaction listeners
     */
    public setupTableInteractions(): void {
        console.log(`🔄 Setting up ${this.entityName} table event listeners...`);
        
        this.setupEditListeners();
        this.setupDeleteListeners();
        this.setupViewListeners();
        
        console.log(`✅ ${this.entityName} table event listeners setup completed`);
    }

    /**
     * Setup edit button listeners
     */
    private setupEditListeners(): void {
        document.addEventListener('click', (event) => {
            const editBtn = (event.target as HTMLElement).closest(`.${this.entityName}-table__edit`);
            if (editBtn) {
                const id = editBtn.getAttribute('data-id');
                if (id) {
                    console.log(`🔄 Edit ${this.entityName}:`, id);
                    this.handleEdit(id);
                }
            }
        });
    }

    /**
     * Setup delete button listeners
     */
    private setupDeleteListeners(): void {
        document.addEventListener('click', (event) => {
            const deleteBtn = (event.target as HTMLElement).closest(`.${this.entityName}-table__delete`);
            if (deleteBtn) {
                const id = deleteBtn.getAttribute('data-id');
                if (id) {
                    console.log(`🔄 Delete ${this.entityName}:`, id);
                    this.handleDelete(parseInt(id));
                }
            }
        });
    }

    /**
     * Setup view button listeners
     */
    private setupViewListeners(): void {
        document.addEventListener('click', (event) => {
            const viewBtn = (event.target as HTMLElement).closest(`.${this.entityName}-table__view`);
            if (viewBtn) {
                const id = viewBtn.getAttribute('data-id');
                if (id) {
                    console.log(`🔄 View ${this.entityName}:`, id);
                    this.handleView(id);
                }
            }
        });
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
    private async handleDelete(id: number): Promise<void> {
        const confirmed = confirm(`Are you sure you want to delete this ${this.entityName}? This action cannot be undone.`);
        
        if (!confirmed) {
            return;
        }
        
        try {
            await this.deleteCallback(id);
        } catch (error) {
            console.error(`❌ Error deleting ${this.entityName}:`, error);
            throw error;
        }
    }
}
