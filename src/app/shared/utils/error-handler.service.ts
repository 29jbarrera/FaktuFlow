import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor() {}
  public handleHttpError(
    error: any,
    setMessagesCallback: (messages: any[]) => void,
    setSingleMessageCallback: (
      severity: string,
      summary: string,
      detail: string
    ) => void
  ): void {
    if (Array.isArray(error.error?.errors)) {
      const messages = error.error.errors.map((e: any) => ({
        severity: 'error',
        summary: 'Error de validación',
        text: e.msg,
      }));
      setMessagesCallback(messages);
    } else if (error.error?.message) {
      setSingleMessageCallback('error', 'Error', error.error.message);
    } else {
      setSingleMessageCallback(
        'error',
        'Error inesperado',
        'Ocurrió un error en el servidor.'
      );
    }
  }
}
