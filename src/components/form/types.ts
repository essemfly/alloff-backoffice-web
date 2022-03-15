export interface Option {
  key: string;
  label: string;
  description?: string;
  value: string | undefined;
  disabled?: boolean;
}
