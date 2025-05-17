import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'importeEur',
})
export class ImporteEurPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (typeof value === 'number') {
      const formatted = value.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `${formatted} €`;
    }
    return '';
  }
}
