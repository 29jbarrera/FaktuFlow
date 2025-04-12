import { Component } from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ClientesService } from '../clientes.service';
import { Cliente, ClientesResponse } from '../cliente.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-clientes-table',
  standalone: true,
  imports: [TableModule, CommonModule, ConfirmDialogModule, ToastModule],
  templateUrl: './clientes-table.component.html',
  styleUrl: './clientes-table.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class ClientesTableComponent {
  clientes: Cliente[] = [];
  totalClientes = 0;
  limit = 5;
  sortField = 'nombre';
  sortOrder = -1;
  currentPage = 1;

  constructor(
    private clientesService: ClientesService,
    private confirmationService: ConfirmationService
  ) {}

  cargarClientes(event: TableLazyLoadEvent = {}): void {
    const {
      first = 0,
      rows = this.limit,
      sortField = this.sortField,
      sortOrder = this.sortOrder,
    } = event;

    const page = Math.floor(first / (rows ?? this.limit)) + 1;
    const finalSortField = Array.isArray(sortField)
      ? sortField[0]
      : sortField || 'nombre';
    const finalSortOrder = sortOrder ?? -1;

    this.clientesService
      .getClientesTable(
        page,
        rows ?? this.limit,
        finalSortField,
        finalSortOrder
      )
      .subscribe((response: ClientesResponse) => {
        this.clientes = response.clientes;
        this.totalClientes = response.total;
      });
  }

  deleteCliente(id: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este cliente?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clientesService.deleteCliente(id).subscribe(
          (response) => {
            this.clientes = this.clientes.filter(
              (cliente) => cliente.id !== id
            );
          },
          (error) => {
            console.error('❌ Error al eliminar la factura:', error);
          }
        );
      },
      reject: () => {},
    });
  }
}
