import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FormComponent } from '../../components/form/form.component';
import { CommonModule } from '@angular/common';
import { IngresosTableComponent } from './ingresos-table/ingresos-table.component';

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
  gastosTableComponent!: IngresosTableComponent;

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
      options: this.categoriaOptions,
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
      icon: '',
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
