export interface Option {
  key: string;
  label: string;
  description?: string;
  value: string | number | undefined;
  disabled?: boolean;
}
