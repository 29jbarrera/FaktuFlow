import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FormComponent } from '../../components/form/form.component';
import { CommonModule } from '@angular/common';
import { GastosTableComponent } from './gastos-table/gastos-table.component';
import { GastosService } from './gastos.service';
import { AuthService } from '../auth/auth.service';
import { ValidationMessage } from '../../interfaces/validation-message.interface';
import { CreateGastoRequest } from './gastos.interface';
import { ErrorHandlerService } from '../../shared/utils/error-handler.service';

@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [HeaderComponent, FormComponent, CommonModule, GastosTableComponent],
  templateUrl: './gastos.component.html',
  styleUrl: './gastos.component.scss',
})
export class GastosComponent {
  @ViewChild('formulario') formularioComponent!: FormComponent;
  @ViewChild(GastosTableComponent)
  gastosTableComponent!: GastosTableComponent;
  formModel = {
    nombre_gasto: '',
    categoria: null,
    fecha: '',
    importe_total: null,
    descripcion: '',
    usuario_id: null,
  };

  loadingClientes = true;
  validationMessages: ValidationMessage[] = [];
  categoriaOptions = [
    { label: 'Mano de obra', value: 'Mano de obra' },
    { label: 'Transporte', value: 'Transporte' },
    { label: 'Cuota', value: 'Cuota' },
    { label: 'Otros', value: 'Otros' },
  ];

  formFields = [
    {
      name: 'nombre_gasto',
      label: 'Nombre del gasto *',
      type: 'text',
      placeholder: 'Ingrese el nombre del gasto...',
      required: true,
      icon: 'pi pi-wallet',
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
      name: 'fecha',
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
    },
    {
      name: 'submit',
      label: 'Crear Gasto',
      type: 'submit',
      required: false,
    },
  ];

  constructor(
    private readonly gastosService: GastosService,
    private readonly authService: AuthService,
    private errorHandler: ErrorHandlerService
  ) {}

  createGasto(gasto: CreateGastoRequest): void {
    this.validationMessages = [];

    if (!this.validarFormulario(gasto)) return;

    const usuarioId = this.authService.getUserId();
    if (!usuarioId) {
      this.setValidationMessage(
        'error',
        'Error de autenticación',
        'No se ha podido identificar al usuario.'
      );
      return;
    }

    gasto.usuario_id = usuarioId;

    this.gastosService.createGasto(gasto).subscribe({
      next: () => {
        this.validationMessages = [
          {
            severity: 'success',
            summary: 'Éxito',
            text: 'Gasto creado exitosamente!',
          },
        ];
        this.gastosTableComponent.cargarGastos();
        this.formularioComponent.resetForm();
      },
      error: (error) => {
        if (
          error?.status === 400 &&
          error?.error?.message ===
            'Has alcanzado el límite de 200 gastos por usuario. Si necesitas más capacidad, contacta al administrador.'
        ) {
          this.validationMessages = [
            {
              severity: 'warn',
              summary: 'Límite máximo alcanzado',
              text: 'Has alcanzado el límite de 200 gastos por usuario. Si necesitas más capacidad, contacta al administrador.',
            },
          ];
        } else {
          this.errorHandler.handleHttpError(
            error,
            (msgs) => (this.validationMessages = msgs),
            this.setValidationMessage.bind(this)
          );
        }
      },
    });
  }

  private validarFormulario(gastos: CreateGastoRequest): boolean {
    const { nombre_gasto, categoria, fecha, importe_total } = gastos;
    if (
      !nombre_gasto ||
      nombre_gasto.trim() === '' ||
      !categoria ||
      categoria.trim() === '' ||
      !fecha ||
      fecha.toString().trim() === '' ||
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
