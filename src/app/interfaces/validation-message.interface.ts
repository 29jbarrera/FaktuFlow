export interface ValidationMessage {
  severity: 'error' | 'success' | 'info' | 'warn';
  summary: string;
  text: string;
}
