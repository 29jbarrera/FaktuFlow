import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { FormComponent } from '../../components/form/form.component';
import { FacturasTableComponent } from './facturas-table/facturas-table.component';
import { FacturasService } from './service/facturas.service';
import { Factura } from './factura.interface';
import { AuthService } from '../auth/auth.service';
import { ClientesService } from '../clientes/clientes.service';
import { Cliente } from '../clientes/cliente.interface';

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [
    HeaderComponent,
    FormComponent,
    CommonModule,
    FacturasTableComponent,
  ],
  templateUrl: './facturas.component.html',
  styleUrl: './facturas.component.scss',
})
export class FacturasComponent implements OnInit {
  @ViewChild('formulario') formularioComponent!: FormComponent;
  @ViewChild(FacturasTableComponent)
  facturasTableComponent!: FacturasTableComponent;

  formModel = {
    numero: '',
    cliente_id: '',
    fecha_emision: null,
    importe: null,
    descripcion: '',
    estado: false,
    file: null,
    usuario_id: null,
  };

  clientes: { label: string; value: number }[] = [];
  loadingClientes = true;
  validationMessages: { severity: string; summary: string; text: string }[] =
    [];

  constructor(
    private facturasService: FacturasService,
    private authService: AuthService,
    private clientesService: ClientesService
  ) {}

  ngOnInit(): void {
    this.cargarClientesSelect();
  }

  formFields = [
    {
      name: 'numero',
      label: 'Número de Factura',
      type: 'text',
      placeholder: 'Ingresa el número de la factura...',
      required: true,
      icon: 'pi pi-file', // Icono de archivo
    },
    {
      name: 'nombre',
      label: 'Cliente',
      type: 'select',
      options: this.clientes,
      required: true,
      icon: 'pi pi-tags', // Icono de etiqueta
      id: 'cliente_id',
    },
    {
      name: 'fecha_emision',
      label: 'Fecha',
      type: 'date',
      required: true,
      icon: 'pi pi-calendar', // Icono de calendario
    },
    {
      name: 'importe',
      label: 'Importe',
      type: 'number',
      placeholder: 'Ingresa el importe...',
      required: true,
      icon: 'pi pi-dollar', // Icono de dólar
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Ingresa una descripción...',
      required: false,
      icon: 'pi pi-pencil', // Icono de lápiz
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
      icon: 'pi pi-upload', // Icono de subida
    },
    {
      name: 'submit',
      label: 'Crear Factura',
      type: 'submit',
      required: false,
    },
  ];

  crearFactura(formModel: any) {
    this.validationMessages = []; // Limpiar mensajes anteriores

    const camposRequeridos = [
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
          text: 'Por favor completa todos los campos obligatorios.',
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
      const fecha = formModel.fecha_emision;
      const yyyy = fecha.getFullYear();
      const mm = String(fecha.getMonth() + 1).padStart(2, '0');
      const dd = String(fecha.getDate()).padStart(2, '0');
      formModel.fecha_emision = `${yyyy}-${mm}-${dd}`;
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
        console.error('Error al crear la factura:', error);

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

  cargarClientesSelect() {
    this.clientesService.getClientes().subscribe({
      next: (response) => {
        if (response && response.clientes) {
          this.clientes = response.clientes.map((cliente) => ({
            label: cliente.nombre,
            value: cliente.id,
          }));
          this.loadingClientes = false;
        } else {
          console.error('No se encontraron clientes en la respuesta');
          this.loadingClientes = false;
        }
      },
      error: (error) => {
        console.error('❌ Error al obtener los clientes:', error);
        this.loadingClientes = false;
      },
    });
  }
}
