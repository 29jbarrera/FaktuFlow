import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clientes-table',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './clientes-table.component.html',
  styleUrl: './clientes-table.component.scss',
})
export class ClientesTableComponent {
  clientes = [
    {
      name: 'Carlos Pérez',
      email: 'carlos.perez@example.com',
      phone: '+34 600 123 456',
      address: 'Calle Mayor 15, Madrid',
    },
    {
      name: 'Laura Gómez',
      email: 'laura.gomez@example.com',
      phone: '+34 655 987 321',
      address: 'Av. Andalucía 34, Sevilla',
    },
    {
      name: 'Martín López',
      email: 'martin.lopez@example.com',
      phone: '+34 610 456 789',
      address: 'Carrer de Sants 78, Barcelona',
    },
    {
      name: 'Ana Fernández',
      email: 'ana.fernandez@example.com',
      phone: '+34 620 234 567',
      address: 'Gran Vía 120, Valencia',
    },
    {
      name: 'David Rodríguez',
      email: 'david.rodriguez@example.com',
      phone: '+34 635 876 543',
      address: 'Plaza España 4, Zaragoza',
    },
    {
      name: 'Elena Martínez',
      email: 'elena.martinez@example.com',
      phone: '+34 699 654 321',
      address: 'Rúa Nova 22, A Coruña',
    },
    {
      name: 'Sergio Jiménez',
      email: 'sergio.jimenez@example.com',
      phone: '+34 645 333 222',
      address: 'Av. Diagonal 90, Barcelona',
    },
    {
      name: 'Paula Sánchez',
      email: 'paula.sanchez@example.com',
      phone: '+34 689 111 222',
      address: 'Calle Alcalá 45, Madrid',
    },
    {
      name: 'Javier Torres',
      email: 'javier.torres@example.com',
      phone: '+34 677 444 555',
      address: 'Paseo Marítimo 10, Málaga',
    },
    {
      name: 'Natalia Ruiz',
      email: 'natalia.ruiz@example.com',
      phone: '+34 600 999 888',
      address: 'Av. de la Constitución 32, Sevilla',
    },
  ];
}
