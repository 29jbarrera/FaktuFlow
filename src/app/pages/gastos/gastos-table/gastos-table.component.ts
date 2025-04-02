import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-gastos-table',
    imports: [TableModule, CommonModule],
    templateUrl: './gastos-table.component.html',
    styleUrl: './gastos-table.component.scss'
})
export class GastosTableComponent {
  gastos = [
    {
      name: 'Compra de oficina',
      category: 'Material',
      date: new Date(2024, 2, 10),
      amount: 150,
      description: 'Compra de bolígrafos y papel',
    },
    {
      name: 'Almuerzo equipo',
      category: 'Comida',
      date: new Date(2024, 2, 15),
      amount: 230,
      description: 'Almuerzo mensual del equipo',
    },
    {
      name: 'Taxi reunión',
      category: 'Transporte',
      date: new Date(2024, 2, 18),
      amount: 35,
      description: 'Viaje en taxi a reunión con cliente',
    },
    {
      name: 'Suscripción software',
      category: 'Tecnología',
      date: new Date(2024, 2, 20),
      amount: 99,
      description: 'Pago mensual de software de gestión',
    },
    {
      name: 'Hosting web',
      category: 'Servicios',
      date: new Date(2024, 2, 22),
      amount: 120,
      description: 'Pago anual del hosting',
    },
    {
      name: 'Compra de café',
      category: 'Oficina',
      date: new Date(2024, 2, 25),
      amount: 50,
      description: 'Café para la oficina',
    },
    {
      name: 'Publicidad en redes',
      category: 'Marketing',
      date: new Date(2024, 2, 28),
      amount: 300,
      description: 'Campaña de Facebook Ads',
    },
    {
      name: 'Reparación de PC',
      category: 'Mantenimiento',
      date: new Date(2024, 3, 1),
      amount: 180,
      description: 'Reparación y mantenimiento de computadoras',
    },
    {
      name: 'Compra de muebles',
      category: 'Oficina',
      date: new Date(2024, 3, 5),
      amount: 450,
      description: 'Compra de sillas ergonómicas',
    },
    {
      name: 'Curso en línea',
      category: 'Educación',
      date: new Date(2024, 3, 7),
      amount: 200,
      description: 'Curso de desarrollo web',
    },
  ];
}
