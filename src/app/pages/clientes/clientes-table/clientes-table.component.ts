import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ClientesService } from '../clientes.service';
import { Cliente } from '../cliente.interface';
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
  constructor(
    private clientesService: ClientesService,
    private confirmationService: ConfirmationService
  ) {}

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
