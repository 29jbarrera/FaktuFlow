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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { logoBase64 } from './imgBase64';

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}

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

  logoBase64: string = '';

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

  public generarPDFConLogo(): void {
    this.exportarPDF(logoBase64);
  }

  exportarPDF(logoBase64: string) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    }) as jsPDFWithAutoTable;
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 14;

    if (logoBase64) {
      const pxToMm = 25.4 / 96; // conversión px a mm
      const fixedWidth = 226 * pxToMm; // ~59.8 mm
      const fixedHeight = 80 * pxToMm; // ~21.17 mm
      const logoX = (pageWidth - fixedWidth) / 2; // centrar imagen horizontalmente
      const logoY = 7; // posición vertical fija (ajusta si quieres)
      const marginBelowImage = 30; // margen deseado en mm
      const textY = logoY + fixedHeight + marginBelowImage;
      doc.addImage(logoBase64, 'PNG', logoX, logoY, fixedWidth, fixedHeight);
    }

    // Títulos principales
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor('#112c35');
    doc.text(`Resumen Anual Finanzas ${this.year}`, marginX, 40);

    const userText = 'Usuario';
    const userWidth = doc.getTextWidth(userText);
    doc.text(userText, pageWidth - marginX - userWidth, 40);

    // Línea divisoria principal
    doc.setDrawColor('#112c35');
    doc.setLineWidth(0.3);
    doc.line(marginX, 44, pageWidth - marginX, 44);

    let currentY = 55;

    const tableStyleCommon = {
      margin: { left: marginX, right: marginX },
      styles: {
        fontSize: 10,
        cellPadding: { top: 2, bottom: 2, left: 1, right: 1 },
        halign: 'center' as const,
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 40 },
        2: { cellWidth: 50 },
      },
      alternateRowStyles: { fillColor: '#f8f8f8' },
      bodyStyles: {
        halign: 'center' as const,
        lineWidth: 0.2,
        lineColor: '#ccc',
      },
    };

    // Función para renderizar tabla con barra divisoria justo abajo
    const renderTable = (
      title: string,
      color: string,
      rows: { mes: string; total: number; totalImporte: number }[],
      columns: string[]
    ) => {
      doc.setFontSize(13);
      doc.setTextColor(color);
      doc.setFont('helvetica', 'bold');
      doc.text(title, marginX, currentY);
      currentY += 4;

      // Barra divisoria
      doc.setDrawColor(color);
      doc.setLineWidth(0.4);
      doc.line(marginX, currentY, pageWidth - marginX, currentY);
      currentY += 4;

      // Anchos de columnas según tu configuración
      const colWidths = [40, 40, 50];
      const tableWidth = colWidths.reduce((a, b) => a + b, 0);

      // Calcular margen izquierdo para centrar tabla
      const marginLeft = (pageWidth - tableWidth) / 2;

      autoTable(doc, {
        startY: currentY,
        head: [columns],
        body: rows.map((r) => [
          this.nombreMes(r.mes),
          r.total,
          r.totalImporte.toFixed(2),
        ]),
        styles: {
          fontSize: 10,
          cellPadding: { top: 2, bottom: 2, left: 1, right: 1 },
          halign: 'center',
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 40 },
          2: { cellWidth: 50 },
        },
        alternateRowStyles: { fillColor: '#f8f8f8' },
        bodyStyles: {
          halign: 'center',
          lineWidth: 0.2,
          lineColor: '#ccc',
        },
        margin: { left: marginLeft },
        headStyles: {
          fillColor: color,
          textColor: '#fff',
          fontStyle: 'bold',
          halign: 'center',
          lineWidth: 0.5,
          lineColor: color,
        },
        theme: 'grid',
      });

      currentY = (doc.lastAutoTable?.finalY || currentY) + 12;
    };

    // Tablas
    if (this.mensualFacturas?.length) {
      renderTable('Facturas Mensuales', '#800020', this.mensualFacturas, [
        'Mes',
        'Facturas',
        'Importe Total',
      ]);
    }

    if (this.mensualGastos?.length) {
      renderTable('Gastos Mensuales', '#003366', this.mensualGastos, [
        'Mes',
        'Gastos',
        'Importe Total',
      ]);
    }

    if (this.mensualIngresos?.length) {
      renderTable('Ingresos Mensuales', '#228B22', this.mensualIngresos, [
        'Mes',
        'Ingresos',
        'Importe Total',
      ]);
    }

    // Cálculo del balance global
    const totalFacturas =
      this.mensualFacturas?.reduce((acc, f) => acc + f.totalImporte, 0) || 0;
    const totalGastos =
      this.mensualGastos?.reduce((acc, g) => acc + g.totalImporte, 0) || 0;
    const totalIngresos =
      this.mensualIngresos?.reduce((acc, i) => acc + i.totalImporte, 0) || 0;
    const balanceFinal = totalIngresos - totalGastos;

    // Balance Global - Título y barra divisoria
    doc.setFontSize(13);
    doc.setTextColor('#112c35');
    doc.setFont('helvetica', 'bold');
    doc.text('Balance Global Anual', marginX, currentY);
    currentY += 4;

    doc.setDrawColor('#112c35');
    doc.setLineWidth(0.4);
    doc.line(marginX, currentY, pageWidth - marginX, currentY);
    currentY += 8;

    // TARJETAS DE RESUMEN
    const tarjetaAltura = 24;
    const tarjetaAncho = (pageWidth - marginX * 2 - 20) / 3; // 3 tarjetas en fila
    const tarjetaMarginY = 10;

    // Las 3 primeras tarjetas en una fila
    const resumenTarjetasFila1 = [
      {
        titulo: 'Total Facturas',
        valor: `${totalFacturas.toFixed(2)} €`,
        color: '#800020',
      },
      {
        titulo: 'Total Gastos',
        valor: `${totalGastos.toFixed(2)} €`,
        color: '#003366',
      },
      {
        titulo: 'Total Ingresos',
        valor: `${totalIngresos.toFixed(2)} €`,
        color: '#228B22',
      },
    ];

    for (let i = 0; i < resumenTarjetasFila1.length; i++) {
      const tarjeta = resumenTarjetasFila1[i];
      const x = marginX + i * (tarjetaAncho + 10);
      const y = currentY;

      // Fondo gris claro uniforme
      doc.setFillColor('#f7f7f7');
      doc.roundedRect(x, y, tarjetaAncho, tarjetaAltura, 2, 2, 'F');

      // Borde del color correspondiente
      doc.setDrawColor(tarjeta.color);
      doc.roundedRect(x, y, tarjetaAncho, tarjetaAltura, 2, 2);

      // Título
      doc.setTextColor('#112c35');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(tarjeta.titulo, x + 5, y + 9);

      // Valor
      doc.setFontSize(12);
      const valorAncho = doc.getTextWidth(tarjeta.valor);
      doc.text(tarjeta.valor, x + tarjetaAncho - valorAncho - 5, y + 17);
    }

    // Segunda fila: tarjeta Balance Final centrada
    currentY += tarjetaAltura + tarjetaMarginY;
    const balanceTarjetaAncho = 100;
    const balanceX = (pageWidth - balanceTarjetaAncho) / 2;

    // Fondo gris claro uniforme
    doc.setFillColor('#f7f7f7');
    doc.roundedRect(
      balanceX,
      currentY,
      balanceTarjetaAncho,
      tarjetaAltura,
      2,
      2,
      'F'
    );

    // Borde
    doc.setDrawColor('#333333');
    doc.roundedRect(
      balanceX,
      currentY,
      balanceTarjetaAncho,
      tarjetaAltura,
      2,
      2
    );

    // Texto
    doc.setTextColor('#000');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Balance Final', balanceX + 5, currentY + 9);

    doc.setFontSize(12);
    const balanceValor = `${balanceFinal.toFixed(2)} €`;
    const balanceValorAncho = doc.getTextWidth(balanceValor);
    doc.text(
      balanceValor,
      balanceX + balanceTarjetaAncho - balanceValorAncho - 5,
      currentY + 17
    );

    // Guardar PDF
    doc.save(`Resumen-Faktuflow-${this.year}.pdf`);
  }
}
