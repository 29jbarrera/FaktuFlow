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
  resumen: any;
  mensual: any[] = [];

  constructor(private DashboardService: DashboardService) {}

  ngOnInit(): void {
    this.cargarResumen();
  }

  cargarResumen() {
    this.loading = true;
    this.DashboardService.getResumenPorYear(this.year).subscribe({
      next: (res) => {
        this.resumen = res.resumen;
        this.mensual = res.mensual;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar resumen:', err);
        this.loading = false;
      },
    });
  }
}
