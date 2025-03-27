import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FormComponent } from '../../components/form/form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [HeaderComponent, FormComponent, CommonModule],
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
    },
    {
      name: 'email',
      label: 'Correo Electrónico',
      type: 'email',
      placeholder: 'Ingresa tu correo electrónico...',
      required: true,
    },
    {
      name: 'phone',
      label: 'Número de Teléfono',
      type: 'number',
      placeholder: 'Ingresa tu número de teléfono...',
      required: true,
    },
    {
      name: 'address',
      label: 'Dirección',
      type: 'text',
      placeholder: 'Ingresa tu dirección...',
      required: true,
    },
    { name: 'submit', label: 'Enviar', type: 'submit', required: false },
  ];
}
