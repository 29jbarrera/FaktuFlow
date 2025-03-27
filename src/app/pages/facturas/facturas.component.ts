import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { FormComponent } from '../../components/form/form.component';

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [HeaderComponent, FormComponent, CommonModule],
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
    },
    {
      name: 'category',
      label: 'Categoría',
      type: 'select',
      options: [
        { label: 'Categoría 1', value: 'cat1' },
        { label: 'Categoría 2', value: 'cat2' },
        { label: 'Categoría 3', value: 'cat3' },
      ],
      required: true,
    },
    {
      name: 'date',
      label: 'Fecha',
      type: 'date',
      required: true,
    },
    {
      name: 'isPaid',
      label: '¿Está pagada?',
      type: 'checkbox',
      required: false,
    },
    {
      name: 'amount',
      label: 'Importe',
      type: 'number',
      placeholder: 'Ingresa el importe...',
      required: true,
    },
    {
      name: 'file',
      label: 'Subir Archivo',
      type: 'file',
      required: false,
    },
    {
      name: 'submit',
      label: 'Enviar',
      type: 'submit',
      required: false,
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Ingresa una descripción...',
      required: false,
    },
  ];
}
