import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FacturasService } from '../service/facturas.service';
import { Factura } from '../factura.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-facturas-table',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    ConfirmDialogModule,
    ToastModule,
    TagModule,
  ],
  templateUrl: './facturas-table.component.html',
  styleUrl: './facturas-table.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class FacturasTableComponent {
  facturas: Factura[] = [];
  totalFacturas: number = 0;
  limit: number = 5;
  sortField: string = 'fecha_emision';
  sortOrder: number = -1;
  currentPage: number = 1;

  constructor(
    private facturasService: FacturasService,
    private confirmationService: ConfirmationService
  ) {}

  cargarFacturas(
    event: any = {
      first: 0,
      rows: this.limit,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
    }
  ) {
    const { first, rows, sortField, sortOrder } = event;
    const page = first / rows + 1;

    this.facturasService
      .getFacturas(page, rows, sortField, sortOrder)
      .subscribe(
        (response) => {
          this.facturas = response.facturas;
          this.totalFacturas = response.total;
        },
        (error) => {
          console.error('Error al cargar las facturas', error);
        }
      );
  }

  deleteFactura(id: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar esta factura?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.facturasService.deleteFactura(id).subscribe(
          (response) => {
            this.facturas = this.facturas.filter(
              (factura) => factura.id !== id
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
