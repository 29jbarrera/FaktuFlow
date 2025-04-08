import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
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
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';

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
    MessageModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  providers: [MessageService],
})
export class FormComponent implements OnInit {
  @Input() formFields: any[] = [];
  @Input() formModel: any = {};
  @Input() clientes: { label: string; value: number }[] = [];
  @Input() validationMessages: { severity: string; text: string }[] = [];
  @Output() formSubmit = new EventEmitter<any>();

  @ViewChild('form', { static: false }) form!: NgForm;

  constructor() {}

  ngOnInit(): void {}

  resetForm(): void {
    this.form.resetForm({
      numero: '',
      cliente_id: '',
      fecha_emision: null,
      importe: null,
      descripcion: '',
      estado: false,
      file: null,
      usuario_id: null,
    });
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
