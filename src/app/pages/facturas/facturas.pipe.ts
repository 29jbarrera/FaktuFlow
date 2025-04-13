import { Pipe, PipeTransform } from '@angular/core';
import { Factura } from './factura.interface';
import { formatFechaToDMY } from '../../shared/utils/date.util';

@Pipe({
  name: 'facturas',
  standalone: true,
})
export class FacturasPipe implements PipeTransform {
  transform(facturas: Factura[], searchTerm: string): Factura[] {
    if (!searchTerm) {
      return facturas;
    }

    const normalizar = (str: string) =>
      str.toLowerCase().replace(/[\s,./-]/g, '');

    const normalizadoTerm = normalizar(searchTerm);

    return facturas.filter((factura) => {
      const numero = factura.numero ? normalizar(factura.numero) : '';
      const descripcion = factura.descripcion
        ? normalizar(factura.descripcion)
        : '';
      const fecha = factura.fecha_emision
        ? normalizar(formatFechaToDMY(new Date(factura.fecha_emision)))
        : '';

      return (
        numero.includes(normalizadoTerm) ||
        descripcion.includes(normalizadoTerm) ||
        fecha.includes(normalizadoTerm)
      );
    });
  }
}
