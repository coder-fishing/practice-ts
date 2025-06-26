export const TagFilter = (tags: string[], activeTag: string): string => {
    return `
        <div class="tag-add-searchbar__tag">
            ${tags.map(tag => `
                <div class="tag-add-searchbar__tag--item${tag === activeTag ? ' item-active' : ''}">
                    <span class="tag-add-searchbar__tag--item-element">${tag}</span>
                </div>
            `).join('')}
        </div>
    `;
}