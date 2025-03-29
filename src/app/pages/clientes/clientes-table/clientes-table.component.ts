import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ClientesService } from '../clientes.service';
import { Cliente } from '../cliente.interface';

@Component({
  selector: 'app-clientes-table',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './clientes-table.component.html',
  styleUrl: './clientes-table.component.scss',
})
export class ClientesTableComponent {
  clientes: Cliente[] = [];
  constructor(private clientesService: ClientesService) {}

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clientesService.getClientes().subscribe(
      (response) => {
        this.clientes = response.clientes;
      },
      (error) => {
        console.error('❌ Error al obtener los clientes:', error);
      }
    );
  }
}
