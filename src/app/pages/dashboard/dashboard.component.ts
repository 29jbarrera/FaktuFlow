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
  resumenIngresos: any;
  mensualFacturas: any[] = [];
  mensualGastos: any[] = [];
  mensualIngresos: any[] = [];
  balanceGlobal: number = 0;
  totalClientes: number = 0;

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
    this.cargarResumenIngresos();
    this.getTotalClientes();
  }

  cargarResumenFacturas() {
    this.loading = true;
    this.DashboardService.getResumenPorYear(this.year).subscribe({
      next: (res) => {
        this.resumenFacturas = res.resumen;
        this.mensualFacturas = res.mensual;
        this.loading = false;
        this.actualizarBalanceGlobal();
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
        this.actualizarBalanceGlobal();
      },
      error: (err) => {
        console.error('❌ Error al cargar resumen de gastos:', err);
        this.loading = false;
      },
    });
  }

  cargarResumenIngresos() {
    this.loading = true;
    this.DashboardService.getResumenIngresosPorYear(this.year).subscribe({
      next: (res) => {
        this.resumenIngresos = res.resumen;
        this.mensualIngresos = res.mensual;
        this.loading = false;
        this.actualizarBalanceGlobal();
      },
      error: (err) => {
        console.error('❌ Error al cargar resumen de gastos:', err);
        this.loading = false;
      },
    });
  }

  changeYear(delta: number) {
    this.year += delta;
    this.cargarResumenFacturas();
    this.cargarResumenGastos();
    this.cargarResumenIngresos();
    this.actualizarBalanceGlobal();
    this.getTotalClientes();
  }

  private actualizarBalanceGlobal() {
    if (this.resumenFacturas && this.resumenGastos && this.resumenIngresos) {
      const totalFacturas = this.resumenFacturas.totalImporte || 0;
      const totalGastos = this.resumenGastos.totalImporte || 0;
      const totalIngresos = this.resumenIngresos.totalImporte || 0;

      this.balanceGlobal = totalIngresos - (totalFacturas + totalGastos);
    }
  }

  getBalanceColor(): string {
    return this.balanceGlobal < 0 ? 'text-red-800' : 'text-[#112c35]';
  }

  getTotalClientes() {
    this.DashboardService.getTotalClientesPorUsuario().subscribe({
      next: (res) => {
        this.totalClientes = res.totalClientes;
      },
      error: (err) => {
        console.error('❌ Error al cargar total de clientes:', err);
      },
    });
  }
}
