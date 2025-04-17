import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FormComponent } from '../../components/form/form.component';
import { CommonModule } from '@angular/common';
import { IngresosTableComponent } from './ingresos-table/ingresos-table.component';
import { IngresoService } from './ingreso.service';
import { AuthService } from '../auth/auth.service';
import { CreateIngresoRequest } from './ingreso.interface';
import { ValidationMessage } from '../../interfaces/validation-message.interface';
import { ErrorHandlerService } from '../../shared/utils/error-handler.service';

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    FormComponent,
    IngresosTableComponent,
  ],
  templateUrl: './ingresos.component.html',
  styleUrl: './ingresos.component.scss',
})
export class IngresosComponent {
  @ViewChild('formulario') formularioComponent!: FormComponent;
  @ViewChild(IngresosTableComponent)
  ingresosTableComponent!: IngresosTableComponent;
  formModel = {
    nombre_ingreso: '',
    categoria: null,
    fecha_ingreso: '',
    importe_total: null,
    descripcion: '',
    usuario_id: null,
  };

  loadingClientes = true;
  validationMessages: ValidationMessage[] = [];
  categoriaOptions = [
    { label: 'Cosecha Pipas', value: 'Cosecha Pipas' },
    { label: 'Cosecha Trigo', value: 'Cosecha Trigo' },
    { label: 'Cosecha Garbanzo', value: 'Cosecha Garbanzo' },
    { label: 'Subvención', value: 'Subvención' },
    { label: 'Salario', value: 'Salario' },
    { label: 'Otros', value: 'Otros' },
  ];

  formFields = [
    {
      name: 'nombre_ingreso',
      label: 'Nombre del ingreso *',
      type: 'text',
      placeholder: 'Ingrese el nombre del ingreso...',
      required: true,
      icon: 'pi pi-pencil',
    },
    {
      name: 'categoria',
      label: 'Categoría *',
      type: 'select',
      options: this.categoriaOptions,
      required: true,
      icon: 'pi pi-tags',
    },
    {
      name: 'fecha_ingreso',
      label: 'Fecha *',
      type: 'date',
      required: true,
      icon: 'pi pi-calendar',
    },
    {
      name: 'importe_total',
      label: 'Importe *',
      type: 'number',
      placeholder: 'Ingresa el importe...',
      required: true,
      icon: 'pi pi-dollar',
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Añade una descripción...',
      required: false,
      icon: 'pi pi-pencil',
    },
    {
      name: '',
      label: '',
      type: '',
      required: false,
      icon: '',
    },
    {
      name: 'submit',
      label: 'Enviar',
      type: 'submit',
      required: false,
      icon: 'pi pi-send',
    },
  ];
  constructor(
    private readonly ingresoService: IngresoService,
    private readonly authService: AuthService,
    private errorHandler: ErrorHandlerService
  ) {}

  createIngreso(ingreso: CreateIngresoRequest): void {
    this.validationMessages = [];

    if (!this.validarFormulario(ingreso)) return;

    const usuarioId = this.authService.getUserId();
    if (!usuarioId) {
      this.setValidationMessage(
        'error',
        'Error de autenticación',
        'No se ha podido identificar al usuario.'
      );
      return;
    }

    ingreso.usuario_id = usuarioId;

    this.ingresoService.createIngreso(ingreso).subscribe({
      next: () => {
        this.validationMessages = [
          {
            severity: 'success',
            summary: 'Éxito',
            text: 'Ingreso creado exitosamente!',
          },
        ];
        this.ingresosTableComponent.cargarIngresos();
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

  private validarFormulario(ingreso: CreateIngresoRequest): boolean {
    const { nombre_ingreso, categoria, fecha_ingreso, importe_total } = ingreso;
    if (
      !nombre_ingreso ||
      nombre_ingreso.trim() === '' ||
      !categoria ||
      categoria.trim() === '' ||
      !fecha_ingreso ||
      fecha_ingreso.toString().trim() === '' ||
      importe_total === null ||
      importe_total === undefined ||
      importe_total.toString().trim() === ''
    ) {
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
