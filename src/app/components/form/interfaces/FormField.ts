export interface FormField {
  name: string;
  label: string;
  type:
    | 'text'
    | 'select'
    | 'date'
    | 'number'
    | 'textarea'
    | 'toggle'
    | 'file'
    | 'submit';
  placeholder?: string;
  required: boolean;
  icon?: string;
  id?: string;
  options?: { label: string; value: number }[];
}
