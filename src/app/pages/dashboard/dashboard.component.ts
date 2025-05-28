import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from './dashboard.service';
import { ChartModule } from 'primeng/chart';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { ImporteEurPipe } from '../../shared/utils/import-eur.pipe';
import { TabsModule } from 'primeng/tabs';
import { LoadingComponent } from '../../components/loading/loading.component';
import { ResumenGastos, GastoMensual } from '../../interfaces/gastosDashboard';
import {
  IngresoMensual,
  ResumenIngresos,
} from '../../interfaces/ingresosDashboard';
import {
  FacturaMensual,
  ResumenFacturasData,
} from '../../interfaces/facturasDashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HeaderComponent,
    FormsModule,
    CommonModule,
    ChartModule,
    ImporteEurPipe,
    TabsModule,
    LoadingComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  totalUsuarios: number = 0;
  totalFacturas: number = 0;
  totalGastos: number = 0;
  totalIngresos: number = 0;
  totalClientesStats: number = 0;
  usuariosConStats: any[] = [];

  success: boolean = false;
  year = new Date().getFullYear();
  loading = false;

  resumenGastos: ResumenGastos | null = null;
  mensualGastos: GastoMensual[] = [];

  resumenIngresos: ResumenIngresos | null = null;
  mensualIngresos: IngresoMensual[] = [];

  resumenFacturas: ResumenFacturasData | null = null;
  mensualFacturas: FacturaMensual[] = [];

  balanceGlobal: number = 0;
  totalClientes: number = 0;

  pendingRequests = 0;

  data: ChartConfiguration<'line' | 'bar'>['data'] = {
    labels: [],
    datasets: [],
  };
  options: ChartOptions<'line' | 'bar'> = {};

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
    this.cargarTotalUsuarios();
    this.cargarStatsByUser();
  }

  get isLoading(): boolean {
    return this.pendingRequests > 0;
  }

  cargarTotalUsuarios(): void {
    this.DashboardService.getTotalUsuarios().subscribe({
      next: (response) => {
        this.totalUsuarios = response.totalUsuarios;
        this.totalFacturas = response.totalFacturas;
        this.totalGastos = response.totalGastos;
        this.totalIngresos = response.totalIngresos;
        this.totalClientesStats = response.totalClientes;

        this.success = true;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.success = false;
      },
    });
  }

  cargarStatsByUser(): void {
    this.DashboardService.getStatsByUser().subscribe({
      next: (response) => {
        this.usuariosConStats = response.usuarios;
        console.log('Stats por usuario:', this.usuariosConStats);
      },
      error: (error) => {
        console.error('Error al cargar stats por usuario:', error);
      },
    });
  }

  cargarResumenFacturas() {
    this.pendingRequests++;
    this.DashboardService.getResumenFacturasPorYear(this.year).subscribe({
      next: (res) => {
        this.resumenFacturas = res.resumen;
        this.mensualFacturas = res.mensual;
        this.loading = false;
        this.actualizarBalanceGlobal();
      },
      error: (err) => {
        this.loading = false;
      },
      complete: () => {
        this.pendingRequests--;
      },
    });
  }

  cargarResumenGastos() {
    this.pendingRequests++;
    this.loading = true;
    this.DashboardService.getResumenGastosPorYear(this.year).subscribe({
      next: (res) => {
        this.resumenGastos = res.resumen;
        this.mensualGastos = res.mensual;
        this.loading = false;
        this.actualizarBalanceGlobal();
      },
      error: (err) => {
        this.loading = false;
      },
      complete: () => {
        this.pendingRequests--;
      },
    });
  }

  cargarResumenIngresos() {
    this.pendingRequests++;
    this.loading = true;
    this.DashboardService.getResumenIngresosPorYear(this.year).subscribe({
      next: (res) => {
        this.resumenIngresos = res.resumen;
        this.mensualIngresos = res.mensual;
        this.loading = false;
        this.actualizarBalanceGlobal();
      },
      error: (err) => {
        this.loading = false;
      },
      complete: () => {
        this.pendingRequests--;
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
    this.configurarGrafico();
  }

  getBalanceColor(): string {
    return this.balanceGlobal < 0 ? 'text-red-800' : 'text-[#112c35]';
  }

  getTotalClientes() {
    this.DashboardService.getTotalClientesPorUsuario().subscribe({
      next: (res) => {
        this.totalClientes = res.totalClientes;
      },
      error: (err) => {},
    });
  }

  configurarGrafico() {
    const labels = this.mensualFacturas.map((item) => this.nombreMes(item.mes));

    const dataFacturas = this.mensualFacturas.map((item) => item.total);
    const dataGastos = this.mensualGastos.map((item) => item.total);
    const dataIngresos = this.mensualIngresos.map((item) => item.total);

    this.data = {
      labels,
      datasets: [
        {
          label: 'Ingresos',
          data: dataIngresos,
          borderWidth: 2,
          borderColor: '#22c55e',
          tension: 0.4,
          fill: false,
        },
        {
          type: 'bar',
          label: 'Facturas',
          data: dataFacturas,
          borderWidth: 2,
          backgroundColor: 'rgba(239, 68, 68, 0.3)',
          borderColor: '#ef4444',
        },
        {
          type: 'bar',
          label: 'Gastos',
          data: dataGastos,
          borderWidth: 2,
          backgroundColor: 'rgba(59, 130, 246, 0.3)',
          borderColor: '#3b82f6',
        },
      ],
    };

    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#374151',
          },
        },
      },
      scales: {
        x: {
          ticks: { color: '#6b7280' },
          grid: { color: '#e5e7eb' },
        },
        y: {
          ticks: { color: '#6b7280' },
          grid: { color: '#e5e7eb' },
        },
      },
    };
  }
}
