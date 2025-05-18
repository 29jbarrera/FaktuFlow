import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'importeEur',
})
export class ImporteEurPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    const num = typeof value === 'number' ? value : parseFloat(value ?? '');

    if (!isNaN(num)) {
      const formatted = num.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `${formatted} €`;
    }

    return '';
  }
}
