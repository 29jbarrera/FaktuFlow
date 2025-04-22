import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  year = new Date().getFullYear();
  loading = false;
  resumenFacturas: any;
  resumenGastos: any;
  mensualFacturas: any[] = [];
  mensualGastos: any[] = [];

  nombreMes(mes: string): string {
    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    const index = parseInt(mes) - 1;
    return meses[index] || 'Desconocido';
  }

  constructor(private DashboardService: DashboardService) {}

  ngOnInit(): void {
    this.cargarResumenFacturas();
    this.cargarResumenGastos();
  }

  cargarResumenFacturas() {
    this.loading = true;
    this.DashboardService.getResumenPorYear(this.year).subscribe({
      next: (res) => {
        this.resumenFacturas = res.resumen;
        this.mensualFacturas = res.mensual;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar resumen de facturas:', err);
        this.loading = false;
      },
    });
  }

  cargarResumenGastos() {
    this.loading = true;
    this.DashboardService.getResumenGastosPorYear(this.year).subscribe({
      next: (res) => {
        this.resumenGastos = res.resumen;
        this.mensualGastos = res.mensual;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar resumen de gastos:', err);
        this.loading = false;
      },
    });
  }
}
