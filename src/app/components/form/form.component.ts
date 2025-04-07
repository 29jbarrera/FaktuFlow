import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { AccordionModule } from 'primeng/accordion';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../pages/clientes/clientes.service';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    InputTextModule,
    SelectModule,
    CommonModule,
    TextareaModule,
    DatePickerModule,
    ButtonModule,
    AccordionModule,
    InputGroupModule,
    InputGroupAddonModule,
    FileUploadModule,
    FormsModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent implements OnInit {
  @Input() formFields: any[] = [];
  @Input() formModel: any = {};
  @Input() clientes: { label: string; value: number }[] = [];
  @Output() formSubmit = new EventEmitter<any>();

  constructor(private clientesService: ClientesService) {}

  ngOnInit(): void {
    // this.cargarClientesSelect();
  }

  cargarClientesSelect() {
    this.clientesService.getClientes().subscribe(
      (response) => {
        this.clientes = response.clientes.map((cliente) => ({
          label: cliente.nombre,
          value: cliente.id,
        }));

        this.formFields.forEach((field: any) => {
          if (field.name === 'cliente_id') {
            field.options = this.clientes;
          }
        });
      },
      (error) => {
        console.error('❌ Error al obtener los clientes:', error);
      }
    );
  }

  onSubmit(event: Event) {
    event.preventDefault(); // Evita la recarga de la página
    this.formSubmit.emit(this.formModel); // Emite el evento cuando se envía el formulario
  }

  isTextInput(field: any): boolean {
    return (
      field.type === 'text' || field.type === 'email' || field.type === 'number'
    );
  }
}
