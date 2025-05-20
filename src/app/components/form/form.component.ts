import {
  Component,
  ElementRef,
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
import { ChangeDetectorRef } from '@angular/core';

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
  @ViewChild('fileInput') fileInput!: ElementRef;

  uploadedFileName: string | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {}

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
      nombre: '',
      email: '',
      telefono: null,
      direccion_fiscal: '',
    });

    this.formModel.file = null;
    this.uploadedFileName = null;

    if (this.fileInput) {
      (this.fileInput as any)?.clear?.();
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.formSubmit.emit(this.formModel);
  }

  isTextInput(field: any): boolean {
    return (
      field.type === 'text' || field.type === 'email' || field.type === 'number'
    );
  }

  onFileSelect(event: any): void {
    const file = event.files[0];
    if (file) {
      this.formModel.archivo = file;
      this.uploadedFileName = file.name;
    }
    this.cdr.detectChanges();
  }

  removeUploadedFile(): void {
    this.formModel.archivo = null;
    this.uploadedFileName = null;

    const fileUploadComponent = this.fileInput?.nativeElement as any;
    if (fileUploadComponent?.clear) {
      fileUploadComponent.clear();
    }
    this.cdr.detectChanges();
  }

  getIcon(severity: string): string {
    switch (severity) {
      case 'success':
        return 'pi pi-check-circle';
      case 'info':
        return 'pi pi-info-circle';
      case 'warn':
        return 'pi pi-exclamation-triangle';
      case 'error':
        return 'pi pi-times-circle';
      default:
        return 'pi pi-info-circle';
    }
  }
}
