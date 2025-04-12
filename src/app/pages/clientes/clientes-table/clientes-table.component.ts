import { Component } from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ClientesService } from '../clientes.service';
import { Cliente, ClientesResponse } from '../cliente.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-clientes-table',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    ConfirmDialogModule,
    ToastModule,
    DialogModule,
    InputGroupAddonModule,
    InputGroupModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './clientes-table.component.html',
  styleUrl: './clientes-table.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class ClientesTableComponent {
  clientes: Cliente[] = [];
  totalClientes = 0;
  limit = 5;
  sortField = 'nombre';
  sortOrder = 1;
  currentPage = 1;

  clienteSeleccionado: Partial<Cliente> = {};
  openDialog = false;

  constructor(
    private clientesService: ClientesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
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
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.clientesService.deleteCliente(id).subscribe((response) => {
          this.clientes = this.clientes.filter((cliente) => cliente.id !== id);
        });
        this.messageService.add({
          severity: 'success',
          summary: 'Cliente Eliminado',
          detail: 'El cliente ha sido eliminada exitosamente.',
          life: 4000,
        });

        this.cargarClientes();
      },
      reject: () => {},
    });
  }

  abrirModalEdicion(cliente: Cliente): void {
    this.clienteSeleccionado = { ...cliente };
    this.openDialog = true;
  }
}
