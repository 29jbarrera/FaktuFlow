import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FormComponent } from '../../components/form/form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormComponent],
  templateUrl: './ingresos.component.html',
  styleUrl: './ingresos.component.scss',
})
export class IngresosComponent {
  formFields = [
    {
      name: 'name',
      label: 'Nombre del ingreso',
      type: 'text',
      placeholder: 'Ingreso...',
      required: true,
      icon: 'pi pi-pencil', // Icono de lápiz
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
      icon: 'pi pi-dollar', // Icono de dinero
    },
    {
      name: 'submit',
      label: 'Enviar',
      type: 'submit',
      required: false,
      icon: 'pi pi-send', // Icono de enviar
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Añade una descripción...',
      required: false,
      icon: 'pi pi-pencil', // Icono de lápiz
    },
  ];
}
