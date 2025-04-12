import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FormComponent } from '../../components/form/form.component';
import { CommonModule } from '@angular/common';
import { ClientesTableComponent } from './clientes-table/clientes-table.component';
import { ValidationMessage } from '../../interfaces/validation-message.interface';
import { CreateClienteRequest } from './cliente.interface';
import { ClientesService } from './clientes.service';
import { AuthService } from '../auth/auth.service';

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
  @ViewChild('formulario') formularioComponent!: FormComponent;
  @ViewChild(ClientesTableComponent)
  clientesTableComponent!: ClientesTableComponent;

  formModel: CreateClienteRequest = {
    nombre: '',
    email: '',
    telefono: 0,
    direccion_fiscal: '',
    usuario_id: 0,
  };

  loadingClientes = true;
  validationMessages: ValidationMessage[] = [];

  formFields = [
    {
      name: 'nombre',
      label: 'Nombre o Razón social *',
      type: 'text',
      placeholder: 'Ingresa el nombre completo...',
      required: true,
      icon: 'pi pi-user',
    },
    {
      name: 'email',
      label: 'Correo Electrónico',
      type: 'email',
      placeholder: 'Ingresa el correo electrónico...',
      required: false,
      icon: 'pi pi-envelope',
    },
    {
      name: 'telefono',
      label: 'Número de Teléfono',
      type: 'number',
      placeholder: 'Ingresa el número de teléfono...',
      required: false,
      icon: 'pi pi-phone',
    },
    {
      name: 'direccion_fiscal',
      label: 'Dirección',
      type: 'text',
      placeholder: 'Ingresa tu dirección...',
      required: false,
      icon: 'pi pi-map-marker',
    },
    { name: 'submit', label: 'Crear Cliente', type: 'submit', required: false },
  ];

  constructor(
    private clientesService: ClientesService,
    private authService: AuthService
  ) {}

  createCliente(cliente: CreateClienteRequest) {
    this.validationMessages = [];

    if (!cliente.nombre || cliente.nombre.trim() === '') {
      this.validationMessages = [
        {
          severity: 'error',
          summary: 'Campos incompletos',
          text: 'Por favor completa todos los campos obligatorios. (*)',
        },
      ];
      return;
    }
    const usuarioId = this.authService.getUserId();

    if (!usuarioId) {
      this.validationMessages = [
        {
          severity: 'error',
          summary: 'Error de autenticación',
          text: 'No se ha podido identificar al usuario.',
        },
      ];
      return;
    }
    cliente.usuario_id = usuarioId;

    this.clientesService.createCliente(cliente).subscribe({
      next: (response) => {
        this.validationMessages = [
          {
            severity: 'success',
            summary: 'Éxito',
            text: 'Cliente creado  exitosamente!',
          },
        ];
        console.log('Cliente creado:', response);
        this.clientesTableComponent.cargarClientes();

        this.formularioComponent.resetForm();
      },
      error: (error) => {
        // Si viene del backend con array de errores tipo express-validator
        if (Array.isArray(error.error?.errors)) {
          const mensajes = error.error.errors.map((e: any) => e.msg);
          this.validationMessages = mensajes.map((msg: string) => ({
            severity: 'error',
            summary: 'Error de validación',
            text: msg,
          }));
        } else if (error.error?.message) {
          this.validationMessages = [
            {
              severity: 'error',
              summary: 'Error',
              text: error.error.message,
            },
          ];
        } else {
          this.validationMessages = [
            {
              severity: 'error',
              summary: 'Error inesperado',
              text: 'Ocurrió un error al crear el cliente.',
            },
          ];
        }

        console.error('Error creating cliente:', error);
      },
    });
  }
}
