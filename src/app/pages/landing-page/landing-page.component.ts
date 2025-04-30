import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-landing-page',
  imports: [CommonModule, ButtonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  author = {
    name: 'Juan Pérez',
    github: 'YOUR_GITHUB_USERNAME',
  };

  features = [
    {
      icon: 'pi pi-file',
      title: 'Facturación rápida',
      description: 'Crea, gestiona y consulta facturas desde cualquier lugar.',
    },
    {
      icon: 'pi pi-users',
      title: 'Gestión de clientes',
      description: 'Organiza tu base de clientes de forma intuitiva.',
    },
    {
      icon: 'pi pi-chart-line',
      title: 'Resumen financiero',
      description: 'Gráficos y reportes claros mensuales y anuales.',
    },
    {
      icon: 'pi pi-cloud',
      title: 'Acceso en la nube',
      description: 'Trabaja desde cualquier dispositivo sin instalaciones.',
    },
  ];
}
