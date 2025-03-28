import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { FormComponent } from '../../components/form/form.component';
import { FacturasTableComponent } from './facturas-table/facturas-table.component';

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
export class FacturasComponent {
  formFields = [
    {
      name: 'invoiceNumber',
      label: 'Número de Factura',
      type: 'text',
      placeholder: 'Ingresa el número de la factura...',
      required: true,
      icon: 'pi pi-file', // Icono de archivo
    },
    {
      name: 'Cliente',
      label: 'Cliente',
      type: 'select',
      options: [
        { label: 'Cliente 1', value: 'cat1' },
        { label: 'Cliente 2', value: 'cat2' },
        { label: 'Cliente 3', value: 'cat3' },
      ],
      required: true,
      icon: 'pi pi-tags', // Icono de etiqueta
    },
    {
      name: 'date',
      label: 'Fecha',
      type: 'date',
      required: true,
      icon: 'pi pi-calendar', // Icono de calendario
    },
    {
      name: 'amount',
      label: 'Importe',
      type: 'number',
      placeholder: 'Ingresa el importe...',
      required: true,
      icon: 'pi pi-dollar', // Icono de dólar
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Ingresa una descripción...',
      required: false,
      icon: 'pi pi-pencil', // Icono de lápiz
    },
    {
      name: 'toggle',
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
      icon: 'pi pi-send', // Icono de enviar
    },
  ];
}
