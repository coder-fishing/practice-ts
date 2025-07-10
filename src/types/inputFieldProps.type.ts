export type InputFieldProps = {
    label: string;
    name: string;
    value: string | number;
    placeholder?: string;
    type?: string; // 'text', 'number', ...
    textarea?: boolean;
    rows?: number;
    required?: boolean;
    disabled?: boolean;
    options?: { value: string; label: string }[]; // For select inputs
  };
  