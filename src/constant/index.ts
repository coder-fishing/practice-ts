import { caretRight, add, download, cross, save } from '~/assets/icon';

// Export form fields constant
export { PRODUCT_FORM_FIELDS } from './formFields';

export const MENUITEMS = [
    { name: 'Product', notification: 3, link: '/product'},
    { name: 'Categories', notification: 5, link: '/category'},
    { name: 'Orders', notification: 0, link: '/contact'},  
    { name: 'Customer', notification: 2, link: '#'}
]

export const BREADCRUMBS = {
     ADD_CATEGORY: {
        items: [
            { label: 'Dashboard', link: '/dashboard', active: true },
            { label: 'Category List', link: '/category', active: true },
            { label: 'Add Category', active: false }
        ],
        icon: caretRight
    },
    EDIT_CATEGORY: {
        items: [
            { label: 'Dashboard', link: '/dashboard', active: true },
            { label: 'Category List', link: '/category', active: true },
            { label: 'Edit Category', active: false }
        ],
        icon: caretRight
    },
    ADD_PRODUCT: {
        items: [
            { label: 'Dashboard', link: '/dashboard', active: true },
            { label: 'Product List', link: '/product', active: true },
            { label: 'Add Product', active: false }
        ],
        icon: caretRight
    },
    EDIT_PRODUCT: {
        items: [
            { label: 'Dashboard', link: '/dashboard', active: true },
            { label: 'Product List', link: '/product', active: true },
            { label: 'Edit Product', active: false }
        ],
        icon: caretRight
    },
    CATEGORY_LIST: {
        items: [
            { label: 'Dashboard', link: '/dashboard', active: true },
            { label: 'Category List', active: false }
        ],
        icon: caretRight
    },
    PRODUCT_LIST: {
        items: [
            { label: 'Dashboard', link: '/dashboard', active: true },
            { label: 'Product List', active: false }
        ],
        icon: caretRight
    }
}

export const BUTTON_GROUPS = {
    LIST: {
        CATEGORY: [
            {
            text: 'Export',
            icon: download,
            className: 'product-title__buttons--download'
            },
            {
            text: 'Add Category',
            icon: add,
            className: 'product-title__buttons--add',
            link: '/addcategory'
            }
        ]
        ,
        PRODUCT: [
            {
                text: 'Export',
                icon: download,
                className: 'product-title__buttons--download'
            },
            {
                text: 'Add Product',
                icon: add,
                className: 'product-title__buttons--add',
                link:'/addproduct'
            }
        ]
    }     
    ,
    FORM: {
        CATEGORY:[
            {
            text: 'Cancel',
            icon: cross,
            className: 'product-title__buttons--cancel'
            },

            {
            text: 'Save',
            icon: save,
            className: 'product-title__buttons--add',
            id: 'saveCategoryBtn'
            }
        ],

        PRODUCT: [
            {
                text: 'Cancel',
                icon: cross,
                className: 'product-title__buttons--cancel'
            },
            {
                text: 'Save',
                icon: save,
                className: 'product-title__buttons--add',
                id: 'saveProductBtn'
            }
        ]
    }
};

export const TAG_FILTERS = {
    PRODUCT: [
        'All Products',
        'Published',
        'Low Stock',
        'Draft'
    ],
    CATEGORY: [
        'All Categories',
        'Published',
        'Draft'
    ]
};
