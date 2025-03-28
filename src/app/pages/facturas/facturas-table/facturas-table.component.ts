import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FacturasService } from '../service/facturas.service';

@Component({
  selector: 'app-facturas-table',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './facturas-table.component.html',
  styleUrl: './facturas-table.component.scss',
})
export class FacturasTableComponent {
  facturas: any[] = [];
  constructor(private facturasService: FacturasService) {}

  ngOnInit() {
    this.cargarFacturas();
  }

  cargarFacturas() {
    this.facturasService.getFacturas().subscribe(
      (response) => {
        this.facturas = response.facturas;
        console.log(response);
      },
      (error) => {
        console.error('❌ Error al obtener las facturas:', error);
      }
    );
  }
}
