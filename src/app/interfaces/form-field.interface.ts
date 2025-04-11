export interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required: boolean;
  icon?: string;
  options?: { label: string; value: any }[];
  id?: string;
}
