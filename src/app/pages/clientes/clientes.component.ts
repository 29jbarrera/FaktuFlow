import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FormComponent } from '../../components/form/form.component';
import { CommonModule } from '@angular/common';
import { ClientesTableComponent } from './clientes-table/clientes-table.component';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    HeaderComponent,
    FormComponent,
    CommonModule,
    ClientesTableComponent,
  ],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss',
})
export class ClientesComponent {
  formFields = [
    {
      name: 'name',
      label: 'Nombre o Razón social',
      type: 'text',
      placeholder: 'Ingresa tu nombre completo...',
      required: true,
      icon: 'pi pi-user', // Icono para el campo de texto
    },
    {
      name: 'email',
      label: 'Correo Electrónico',
      type: 'email',
      placeholder: 'Ingresa tu correo electrónico...',
      required: true,
      icon: 'pi pi-envelope', // Icono para el correo electrónico
    },
    {
      name: 'phone',
      label: 'Número de Teléfono',
      type: 'number',
      placeholder: 'Ingresa tu número de teléfono...',
      required: true,
      icon: 'pi pi-phone', // Icono para el teléfono
    },
    {
      name: 'address',
      label: 'Dirección',
      type: 'text',
      placeholder: 'Ingresa tu dirección...',
      required: true,
      icon: 'pi pi-map-marker', // Icono para la dirección
    },
    { name: 'submit', label: 'Enviar', type: 'submit', required: false },
  ];
}
