import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-ingresos-table',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './ingresos-table.component.html',
  styleUrl: './ingresos-table.component.scss',
})
export class IngresosTableComponent {
  ingresos = [
    {
      name: 'Venta de software',
      category: 'Ventas',
      date: new Date(2024, 2, 5),
      amount: 1200,
      description: 'Licencia de software vendida',
    },
    {
      name: 'Consultoría UX',
      category: 'Servicios',
      date: new Date(2024, 2, 10),
      amount: 800,
      description: 'Asesoría en experiencia de usuario',
    },
    {
      name: 'Ingreso de publicidad',
      category: 'Marketing',
      date: new Date(2024, 2, 15),
      amount: 500,
      description: 'Publicidad en el sitio web',
    },
    {
      name: 'Venta de cursos',
      category: 'Educación',
      date: new Date(2024, 2, 18),
      amount: 300,
      description: 'Curso de diseño web vendido',
    },
    {
      name: 'Mantenimiento web',
      category: 'Tecnología',
      date: new Date(2024, 2, 22),
      amount: 700,
      description: 'Contrato de mantenimiento de sitio web',
    },
    {
      name: 'Freelance diseño',
      category: 'Freelance',
      date: new Date(2024, 2, 25),
      amount: 450,
      description: 'Diseño de logotipo para cliente',
    },
    {
      name: 'Proyecto de desarrollo',
      category: 'Desarrollo',
      date: new Date(2024, 2, 28),
      amount: 2500,
      description: 'Desarrollo de aplicación móvil',
    },
    {
      name: 'Afiliación Amazon',
      category: 'Afiliados',
      date: new Date(2024, 3, 1),
      amount: 150,
      description: 'Comisiones por afiliados',
    },
    {
      name: 'Venta de plantillas',
      category: 'E-commerce',
      date: new Date(2024, 3, 5),
      amount: 600,
      description: 'Venta de plantillas de WordPress',
    },
    {
      name: 'Donación de cliente',
      category: 'Otros',
      date: new Date(2024, 3, 7),
      amount: 100,
      description: 'Cliente satisfecho dejó propina',
    },
  ];
}
