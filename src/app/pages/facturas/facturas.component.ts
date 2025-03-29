import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { FormComponent } from '../../components/form/form.component';
import { FacturasTableComponent } from './facturas-table/facturas-table.component';
import { FacturasService } from './service/facturas.service';
import { Factura } from './factura.interface';
import { AuthService } from '../auth/auth.service';
import { ClientesService } from '../clientes/clientes.service';
import { Cliente } from '../clientes/cliente.interface';
import { of } from 'rxjs'; // Usado para manejar valores retrasados
import { delay } from 'rxjs/operators';

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

  constructor(
    private facturasService: FacturasService,
    private authService: AuthService,
    private clientesService: ClientesService
  ) {}

  ngOnInit(): void {}

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
      name: 'cliente_id',
      label: 'Cliente',
      type: 'select',
      options: this.clientes,
      required: true,
      icon: 'pi pi-tags', // Icono de etiqueta
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
      label: 'Enviar',
      type: 'submit',
      required: false,
    },
  ];

  crearFactura(formModel: any) {
    const usuarioId = this.authService.getUserId();

    if (!usuarioId) {
      console.error('❌ Error: usuario_id no encontrado en sessionStorage');
      return;
    }

    formModel.usuario_id = usuarioId;
    // Aquí se envía al servicio con los datos del formulario
    this.facturasService.createFactura(formModel).subscribe(
      (response) => {
        console.log('Factura creada con éxito:', response);
        // Aquí puedes redirigir a la lista de facturas o mostrar un mensaje de éxito
      },
      (error) => {
        console.error('Error al crear la factura:', error);
      }
    );
  }
}
