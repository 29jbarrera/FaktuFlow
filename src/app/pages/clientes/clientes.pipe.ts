import { Pipe, PipeTransform } from '@angular/core';
import { Cliente } from './cliente.interface';

@Pipe({
  name: 'clientes',
})
export class ClientesPipe implements PipeTransform {
  transform(clientes: Cliente[], searchTerm: string): Cliente[] {
    if (!searchTerm) {
      return clientes;
    }

    const normalizar = (str: string) =>
      str.toLowerCase().replace(/[\s,./-]/g, '');

    const normalizadoTerm = normalizar(searchTerm);

    return clientes.filter((cliente) => {
      const nombre = cliente.nombre ? normalizar(cliente.nombre) : '';
      return nombre.includes(normalizadoTerm);
    });
  }
}
