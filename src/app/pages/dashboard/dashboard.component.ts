import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from './dashboard.service';
import { ChartModule } from 'primeng/chart';
import { ImporteEurPipe } from '../../shared/utils/import-eur.pipe';
import { TabsModule } from 'primeng/tabs';
import { LoadingComponent } from '../../components/loading/loading.component';

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
  success: boolean = false;
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

  pendingRequests = 0;

  data: any;
  options: any;

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
  }

  get isLoading(): boolean {
    return this.pendingRequests > 0;
  }

  cargarTotalUsuarios(): void {
    this.DashboardService.getTotalUsuarios().subscribe({
      next: (response) => {
        this.totalUsuarios = response.totalUsuarios;
        this.success = true;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.success = false;
      },
    });
  }

  cargarResumenFacturas() {
    this.pendingRequests++;
    this.DashboardService.getResumenPorYear(this.year).subscribe({
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
        setTimeout(() => {
          this.pendingRequests--;
        }, 3000);
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
          tension: 0.4,
          fill: false,
        },
        {
          type: 'bar',
          label: 'Gastos',
          data: dataGastos,
          borderWidth: 2,
          backgroundColor: 'rgba(59, 130, 246, 0.3)',
          borderColor: '#3b82f6',
          tension: 0.4,
          fill: false,
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
