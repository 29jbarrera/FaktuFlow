import { Component } from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ClientesService } from '../clientes.service';
import {
  Cliente,
  ClientesResponse,
  CreateClienteRequest,
} from '../cliente.interface';
import { ClientesPipe } from '../clientes.pipe';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ValidationMessage } from '../../../interfaces/validation-message.interface';
import { MessageModule } from 'primeng/message';

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
    MessageModule,
    ClientesPipe,
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
  validationMessages: ValidationMessage[] = [];

  searchTerm = '';

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

  actualizarCliente(): void {
    this.validationMessages = [];

    if (!this.clienteSeleccionado.id) return;

    if (
      !this.clienteSeleccionado.nombre ||
      this.clienteSeleccionado.nombre.trim() === ''
    ) {
      this.validationMessages.push({
        severity: 'error',
        summary: 'Campos incompletos',
        text: 'El nombre es obligatorio.',
      });
    }

    const clienteActualizado: CreateClienteRequest = {
      nombre: this.clienteSeleccionado.nombre!,
      email: this.clienteSeleccionado.email,
      telefono: this.clienteSeleccionado.telefono,
      usuario_id: this.clienteSeleccionado.usuario_id!,
      direccion_fiscal: this.clienteSeleccionado.direccion_fiscal,
    };

    if (!clienteActualizado.email || clienteActualizado.email.trim() === '') {
      delete clienteActualizado.email; // Elimina el email si está vacío o nulo
    }

    if (!clienteActualizado.telefono || clienteActualizado.telefono === 0) {
      delete clienteActualizado.telefono; // Elimina el teléfono si está vacío o nulo
    }

    if (this.validationMessages.length > 0) {
      return;
    }

    this.clientesService
      .updateCliente(this.clienteSeleccionado.id, clienteActualizado)
      .subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Cliente Actualizado',
            detail: 'El cliente ha sido actualizado exitosamente.',
            life: 4000,
          });
          this.cargarClientes();
          this.openDialog = false;
        },
        (error) => {
          if (error?.error?.errors) {
            error.error.errors.forEach((e: any) => {
              // Agregar mensajes específicos de backend
              if (e.path === 'email') {
                this.validationMessages.push({
                  severity: 'error',
                  summary: 'Error en el email',
                  text: 'El formato del email no es válido.',
                });
              }

              if (e.path === 'telefono') {
                this.validationMessages.push({
                  severity: 'error',
                  summary: 'Error en el teléfono',
                  text: 'El teléfono debe tener exactamente 9 dígitos numéricos.',
                });
              }
            });
          } else {
            // Manejo de otros errores generales
            this.messageService.add({
              severity: 'warn',
              summary: 'Error inesperado',
              detail:
                error.message || 'Ocurrió un error al actualizar el cliente.',
              life: 4000,
            });
          }
        }
      );
  }
}
