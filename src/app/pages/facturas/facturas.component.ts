import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FormComponent } from '../../components/form/form.component';
import { FacturasTableComponent } from './facturas-table/facturas-table.component';
import { FacturasService } from './facturas.service';
import { AuthService } from '../auth/auth.service';
import { ClientesService } from '../clientes/clientes.service';
import { formatFechaToYMD } from '../../shared/utils/date.util';
import { CreateFacturaRequest } from './factura.interface';
import { Cliente } from '../clientes/cliente.interface';
import { FormField } from '../../interfaces/form-field.interface';
import { ValidationMessage } from '../../interfaces/validation-message.interface';

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FormComponent,
    FacturasTableComponent,
  ],
  templateUrl: './facturas.component.html',
  styleUrl: './facturas.component.scss',
})
export class FacturasComponent implements OnInit {
  @ViewChild('formulario') formularioComponent!: FormComponent;
  @ViewChild(FacturasTableComponent)
  facturasTableComponent!: FacturasTableComponent;

  formModel: CreateFacturaRequest & {
    file: File | null;
    usuario_id: number | null;
  } = {
    numero: '',
    cliente_id: 0,
    fecha_emision: '',
    importe: null,
    descripcion: '',
    estado: false,
    file: null,
    usuario_id: null,
  };

  clientes: { label: string; value: number }[] = [];
  loadingClientes = true;

  validationMessages: ValidationMessage[] = [];

  formFields: FormField[] = [
    {
      name: 'numero',
      label: 'Número de Factura *',
      type: 'text',
      placeholder: 'Ingresa el número de la factura...',
      required: true,
      icon: 'pi pi-file',
    },
    {
      name: 'cliente_id',
      label: 'Cliente *',
      type: 'select',
      options: this.clientes,
      required: true,
      icon: 'pi pi-tags',
      id: 'cliente_id',
    },
    {
      name: 'fecha_emision',
      label: 'Fecha *',
      type: 'date',
      required: true,
      icon: 'pi pi-calendar',
    },
    {
      name: 'importe',
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
      placeholder: 'Ingresa una descripción...',
      required: false,
      icon: 'pi pi-pencil',
    },
    {
      name: 'estado',
      label: '¿Está pagada?',
      type: 'toggle',
      required: false,
    },
    {
      name: 'file',
      label: 'Subir Archivo',
      type: 'file',
      required: false,
      icon: 'pi pi-upload',
    },
    {
      name: 'submit',
      label: 'Crear Factura',
      type: 'submit',
      required: false,
    },
  ];

  constructor(
    private facturasService: FacturasService,
    private authService: AuthService,
    private clientesService: ClientesService
  ) {}

  ngOnInit(): void {
    this.cargarClientesSelect();
  }

  crearFactura(formModel: CreateFacturaRequest & { usuario_id?: number }) {
    this.validationMessages = [];

    const camposRequeridos: (keyof CreateFacturaRequest)[] = [
      'numero',
      'cliente_id',
      'fecha_emision',
      'importe',
    ];
    const camposFaltantes = camposRequeridos.filter(
      (campo) => !formModel[campo]
    );

    if (camposFaltantes.length > 0) {
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
    formModel.usuario_id = usuarioId;

    if (formModel.fecha_emision instanceof Date) {
      formModel.fecha_emision = formatFechaToYMD(formModel.fecha_emision);
    }

    this.facturasService.createFactura(formModel).subscribe(
      (response) => {
        this.validationMessages = [
          {
            severity: 'success',
            summary: 'Éxito',
            text: 'Factura creada exitosamente!',
          },
        ];
        this.facturasTableComponent.cargarFacturas();

        this.formularioComponent.resetForm();
      },
      (error) => {
        if (
          error?.status === 400 &&
          error?.error?.message === 'Ya existe una factura con ese número.'
        ) {
          this.validationMessages = [
            {
              severity: 'error',
              summary: 'Error',
              text: 'Ya existe una factura con ese número.',
            },
          ];
        } else {
          this.validationMessages = [
            {
              severity: 'error',
              summary: 'Error en el servidor',
              text: 'Hubo un problema al crear la factura. Intentalo nuevamente.',
            },
          ];
        }
      }
    );
  }

  cargarClientesSelect(): void {
    this.clientesService.getClientes().subscribe({
      next: (response) => {
        if (response && response.clientes) {
          this.clientes = response.clientes.map((cliente: Cliente) => ({
            label: cliente.nombre,
            value: cliente.id,
          }));
        } else {
          this.loadingClientes = false;
        }
      },
      error: () => {
        this.loadingClientes = false;
      },
    });
  }
}
