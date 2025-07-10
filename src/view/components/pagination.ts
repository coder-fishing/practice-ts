type PaginationProps = {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    caretLeft: string; // icon path
    onPageChange?: (page: number) => void;
  };
  
  export function Pagination({
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    caretLeft,
    onPageChange
  }: PaginationProps): HTMLElement {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
  
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination';
    
    // Generate page numbers with logic similar to your example
    const renderPageNumbers = (): string => {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + 4);
  
      // Adjust start page if we're near the end
      if (endPage - startPage < 4) {
          startPage = Math.max(1, endPage - 4);
      }
  
      let pageNumbersHtml = '';
      
      for (let i = startPage; i <= endPage; i++) {
          pageNumbersHtml += `
            <div class="page-btn ${i === currentPage ? 'active' : ''}" 
                 data-page="${i}">
              ${i}
            </div>
          `;
      }
  
      // Add dots if there are more pages after endPage
      if (endPage < totalPages) {
          pageNumbersHtml += `<div class="dots">...</div>`;
      }
  
      return pageNumbersHtml;
    };
  
    paginationContainer.innerHTML = `
      <div class="pagination__showing">
        Showing ${start}-${end} from ${totalItems}
      </div>
      <div class="pagination__button">
        <div class="pagination__button-caret-left ${currentPage <= 1 ? 'disabled' : ''}" 
             id="prevbtn"
             data-page="${currentPage - 1}">
          <figure class="image"><img src="${caretLeft}" alt="caret left" /></figure>
        </div>
        <div class="pagination__button-page-number" id="page-numbers">
          ${renderPageNumbers()}
        </div>
        <div class="pagination__button-caret-left ${currentPage >= totalPages ? 'disabled' : ''}" 
             id="nextbtn"
             data-page="${currentPage + 1}">
          <figure class="image"><img src="${caretLeft}" alt="caret right" style="transform: rotate(180deg);" /></figure>
        </div>
      </div>
    `;
  
    // Add event listeners if callback provided
    if (onPageChange) {
      paginationContainer.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const clickableElement = target.closest('[data-page]') as HTMLElement;
        
        if (clickableElement && !clickableElement.classList.contains('disabled')) {
          const page = parseInt(clickableElement.dataset.page || '1');
          if (page !== currentPage && page >= 1 && page <= totalPages) {
            onPageChange(page);
          }
        }
      });
    }
  
    return paginationContainer;
  }
  