import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FormComponent } from '../../components/form/form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [HeaderComponent, FormComponent, CommonModule],
  templateUrl: './gastos.component.html',
  styleUrl: './gastos.component.scss',
})
export class GastosComponent {
  formFields = [
    {
      name: 'name',
      label: 'Nombre del gasto',
      type: 'text',
      placeholder: 'Gasto...',
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
      name: 'amount',
      label: 'Importe',
      type: 'number',
      placeholder: 'Ingresa el importe...',
      required: true,
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
      placeholder: 'Añade una descripción...',
      required: false,
    },
  ];
}
