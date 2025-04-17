import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FormComponent } from '../../components/form/form.component';
import { ClientesTableComponent } from './clientes-table/clientes-table.component';
import { ClientesService } from './clientes.service';
import { AuthService } from '../auth/auth.service';
import { ValidationMessage } from '../../interfaces/validation-message.interface';
import { CreateClienteRequest } from './cliente.interface';
import { ErrorHandlerService } from '../../shared/utils/error-handler.service';

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
    telefono: null,
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
    private readonly clientesService: ClientesService,
    private readonly authService: AuthService,
    private errorHandler: ErrorHandlerService
  ) {}

  createCliente(cliente: CreateClienteRequest): void {
    this.validationMessages = [];

    if (!this.validarFormulario(cliente)) return;

    const usuarioId = this.authService.getUserId();
    if (!usuarioId) {
      this.setValidationMessage(
        'error',
        'Error de autenticación',
        'No se ha podido identificar al usuario.'
      );
      return;
    }

    cliente.usuario_id = usuarioId;

    if (!cliente.email) delete cliente.email;
    if (!cliente.telefono) delete cliente.telefono;

    this.clientesService.createCliente(cliente).subscribe({
      next: () => {
        this.validationMessages = [
          {
            severity: 'success',
            summary: 'Éxito',
            text: 'Cliente creado exitosamente!',
          },
        ];
        this.clientesTableComponent.cargarClientes();
        this.formularioComponent.resetForm();
      },
      error: (error) =>
        this.errorHandler.handleHttpError(
          error,
          (msgs) => (this.validationMessages = msgs),
          this.setValidationMessage.bind(this)
        ),
    });
  }

  private validarFormulario(cliente: CreateClienteRequest): boolean {
    if (!cliente.nombre || cliente.nombre.trim() === '') {
      this.setValidationMessage(
        'error',
        'Campos incompletos',
        'Por favor completa todos los campos obligatorios. (*)'
      );
      return false;
    }
    return true;
  }

  private setValidationMessage(
    severity: string,
    summary: string,
    text: string
  ): void {
    this.validationMessages = [{ severity, summary, text }];
  }
}
