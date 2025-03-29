import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FacturasService } from '../service/facturas.service';
import { Factura } from '../factura.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-facturas-table',
  standalone: true,
  imports: [TableModule, CommonModule, ConfirmDialogModule, ToastModule],
  templateUrl: './facturas-table.component.html',
  styleUrl: './facturas-table.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class FacturasTableComponent {
  facturas: Factura[] = [];
  constructor(
    private facturasService: FacturasService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.cargarFacturas();
  }

  cargarFacturas() {
    this.facturasService.getFacturas().subscribe(
      (response) => {
        this.facturas = response.facturas;
      },
      (error) => {
        console.error('❌ Error al obtener las facturas:', error);
      }
    );
  }

  deleteFactura(id: number) {
    // Abre el diálogo de confirmación
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar esta factura?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
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
