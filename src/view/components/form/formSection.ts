export interface FormSectionProps {
    title: string;
    children: string;
    className?: string;
  }
  
  export const FormSection = ({ title, children, className = '' }: FormSectionProps): string => {
    return `
      <div class="form-section ${className}">
        <h3 class="form-section__title">${title}</h3>
        ${children}
      </div>
    `;
  };
  