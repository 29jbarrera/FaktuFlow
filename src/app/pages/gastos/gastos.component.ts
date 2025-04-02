import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FormComponent } from '../../components/form/form.component';
import { CommonModule } from '@angular/common';
import { GastosTableComponent } from './gastos-table/gastos-table.component';

@Component({
    selector: 'app-gastos',
    imports: [HeaderComponent, FormComponent, CommonModule, GastosTableComponent],
    templateUrl: './gastos.component.html',
    styleUrl: './gastos.component.scss'
})
export class GastosComponent {
  formFields = [
    {
      name: 'name',
      label: 'Nombre del gasto',
      type: 'text',
      placeholder: 'Gasto...',
      required: true,
      icon: 'pi pi-wallet', // Icono de billetera
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
      icon: 'pi pi-tags', // Icono de etiquetas
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
      placeholder: 'Añade una descripción...',
      required: false,
      icon: 'pi pi-pencil', // Icono de lápiz
    },
    {
      name: '',
      label: '',
      type: '',
      required: false,
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
