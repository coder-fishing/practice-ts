export interface StatusBadgeProps {
    status: string;
    className?: string;
  }
  
  export const StatusBadge = ({ status, className = '' }: StatusBadgeProps): string => {
    const statusClass = status.toLowerCase().replace(' ', '-');
    return `
      <div class="form-section__title-status--label">                       
        <p class="form-section__title-status--label-text ${statusClass} ${className}" id="status-text">${status}</p>                         
      </div>
    `;
  };
  