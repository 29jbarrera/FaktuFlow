import {
  Component,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientesService } from '../clientes.service';
import {
  Cliente,
  ClientesResponse,
  CreateClienteRequest,
} from '../cliente.interface';
import { ValidationMessage } from '../../../interfaces/validation-message.interface';

import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { LoadingComponent } from '../../../components/loading/loading.component';

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
    LoadingComponent,
  ],
  templateUrl: './clientes-table.component.html',
  styleUrl: './clientes-table.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class ClientesTableComponent implements AfterViewInit, OnDestroy {
  clientes: Cliente[] = [];
  totalClientes = 0;

  loadingEdit = false;
  loadingTable = false;
  loadingDelete = false;

  readonly limit = 5;
  readonly sortField = 'nombre';
  readonly sortOrder = 1;

  currentPage = 1;
  clienteSeleccionado: Partial<Cliente> = {};
  openDialog = false;
  validationMessages: ValidationMessage[] = [];

  searchTerm = '';
  @ViewChild('searchInput') searchInputRef!: ElementRef;
  private searchSub!: Subscription;

  constructor(
    private clientesService: ClientesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngAfterViewInit(): void {
    this.searchSub = fromEvent(this.searchInputRef.nativeElement, 'input')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(600),
        distinctUntilChanged()
      )
      .subscribe((value: string) => {
        this.searchTerm = value.trim();
        this.cargarClientes();
      });
  }

  ngOnDestroy(): void {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
    }
  }

  cargarClientes(event: TableLazyLoadEvent = {}): void {
    this.loadingTable = true;
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
        finalSortOrder,
        this.searchTerm
      )
      .subscribe((response: ClientesResponse) => {
        this.clientes = response.clientes;
        this.totalClientes = response.total;
        this.loadingTable = false;
      });
  }

  deleteCliente(id: number): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este cliente?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      acceptButtonStyleClass: 'p-button danger',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button cancel',
      accept: () => {
        this.ejecutarEliminacionCliente(id);
      },
      reject: () => {
        this.loadingDelete = false;
      },
    });
  }

  private ejecutarEliminacionCliente(id: number): void {
    this.loadingDelete = true;
    this.clientesService.deleteCliente(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Cliente Eliminado',
          detail: 'El cliente ha sido eliminado exitosamente.',
          life: 4000,
        });

        this.cargarClientes();
        this.loadingDelete = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al eliminar',
          detail: 'No se pudo eliminar el cliente. Intenta nuevamente.',
          life: 4000,
        });
        console.error('Error al eliminar cliente:', err);
      },
    });
  }

  abrirModalEdicion(cliente: Cliente): void {
    this.clienteSeleccionado = { ...cliente };
    this.openDialog = true;
  }

  actualizarCliente(): void {
    this.loadingEdit = true;
    this.validationMessages = [];

    if (!this.clienteSeleccionado.id) {
      this.loadingEdit = false;
      return;
    }

    if (!this.clienteSeleccionado.nombre?.trim()) {
      this.loadingEdit = false;
      this.validationMessages.push({
        severity: 'error',
        summary: 'Campos incompletos',
        text: 'El nombre es obligatorio.',
      });
    }

    const clienteActualizado: CreateClienteRequest = {
      nombre: this.clienteSeleccionado.nombre!,
      email: this.clienteSeleccionado.email!,
      telefono: this.clienteSeleccionado.telefono!,
      usuario_id: this.clienteSeleccionado.usuario_id!,
      direccion_fiscal: this.clienteSeleccionado.direccion_fiscal,
    };

    if (!clienteActualizado.email) delete clienteActualizado.email;
    if (!clienteActualizado.telefono || clienteActualizado.telefono === 0)
      delete clienteActualizado.telefono;

    if (this.validationMessages.length > 0) {
      this.loadingEdit = false;
      return;
    }

    this.clientesService
      .updateCliente(this.clienteSeleccionado.id, clienteActualizado)
      .subscribe(
        (response) => {
          this.loadingEdit = false;
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
              if (e.path === 'email') {
                this.loadingEdit = false;
                this.validationMessages.push({
                  severity: 'error',
                  summary: 'Error en el email',
                  text: 'El formato del email no es válido.',
                });
              }

              if (e.path === 'telefono') {
                this.loadingEdit = false;
                this.validationMessages.push({
                  severity: 'error',
                  summary: 'Error en el teléfono',
                  text: 'El teléfono debe tener exactamente 9 dígitos numéricos.',
                });
              }
            });
          } else {
            this.loadingEdit = false;
            this.messageService.add({
              severity: 'warn',
              summary: 'Error inesperado',
              detail:
                error.message || 'Ocurrió un error al actualizar el cliente.',
              life: 4000,
            });
            this.openDialog = false;
          }
        }
      );
  }
}
