import { Component, Input, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FacturasService } from '../service/facturas.service';
import { Factura } from '../factura.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { ChangeDetectorRef } from '@angular/core';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-facturas-table',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    ConfirmDialogModule,
    ToastModule,
    TagModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    SelectModule,
    DatePickerModule,
    InputGroupAddonModule,
    InputGroupModule,
    TextareaModule,
    FileUploadModule,
    Toast,
  ],
  templateUrl: './facturas-table.component.html',
  styleUrl: './facturas-table.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class FacturasTableComponent {
  @Input() clientes: { label: string; value: number }[] = [];
  facturas: Factura[] = [];
  totalFacturas: number = 0;
  limit: number = 5;
  sortField: string = 'fecha_emision';
  sortOrder: number = -1;
  currentPage: number = 1;
  facturaSeleccionada: any = {};
  mostrarDialogo: boolean = false;
  nuevoArchivo: File | null = null;
  archivoMarcadoParaEliminar: boolean = false;

  uploadedFileName: string | null = null; // Para almacenar el nombre del archivo subido
  @ViewChild('fileInput') fileInput: any;

  constructor(
    private facturasService: FacturasService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) {}

  cargarFacturas(
    event: any = {
      first: 0,
      rows: this.limit,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
    }
  ) {
    const { first, rows, sortField, sortOrder } = event;
    const page = first / rows + 1;

    this.facturasService
      .getFacturas(page, rows, sortField, sortOrder)
      .subscribe(
        (response) => {
          this.facturas = response.facturas;
          this.totalFacturas = response.total;
        },
        (error) => {
          console.error('Error al cargar las facturas', error);
        }
      );
  }

  deleteFactura(id: number, numeroFactura: string) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar la factura: ${numeroFactura}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.facturasService.deleteFactura(id).subscribe(
          (response) => {
            this.facturas = this.facturas.filter(
              (factura) => factura.id !== id
            );
          },
          (error) => {
            console.error('❌ Error al eliminar la factura:', error);
          }
        );
      },
      reject: () => {},
    });
  }

  abrirModalEdicion(factura: any) {
    if (factura) {
      this.facturaSeleccionada = { ...factura };
      this.facturaSeleccionada.fecha_emision = new Date(
        this.facturaSeleccionada.fecha_emision
      );
      this.mostrarDialogo = true;
    }
  }

  actualizarFactura() {
    const facturaActualizada: any = {
      cliente_id: this.facturaSeleccionada.cliente_id,
      fecha_emision: this.formatFecha(this.facturaSeleccionada.fecha_emision),
      importe: this.facturaSeleccionada.importe,
      estado: this.facturaSeleccionada.estado,
      numero: this.facturaSeleccionada.numero,
      descripcion: this.facturaSeleccionada.descripcion,
    };

    if (this.facturaSeleccionada.archivo instanceof File) {
      facturaActualizada.archivo = this.facturaSeleccionada.archivo;
    }

    const finalizarActualizacion = () => {
      this.facturasService
        .updateFactura(this.facturaSeleccionada.id, facturaActualizada)
        .subscribe(
          (response) => {
            console.log('Factura actualizada', response);
            this.mostrarDialogo = false;
            this.archivoMarcadoParaEliminar = false; // reseteamos
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmación',
              detail: 'Factura actualizada exitosamente',
              life: 4000,
            });
            this.cargarFacturas();
          },

          (error) => {
            this.messageService.add({
              severity: 'warn',
              summary: 'Error',
              detail: 'Error al actualizar la factura, intente nuevamente',
              life: 4000,
            });
            console.error('Error al actualizar factura', error);
          }
        );
    };

    if (this.archivoMarcadoParaEliminar) {
      this.facturasService
        .deleteArchivoFactura(this.facturaSeleccionada.id)
        .subscribe(
          () => {
            console.log('✅ Archivo eliminado correctamente');
            finalizarActualizacion();
          },
          (error) => {
            console.error(
              '❌ Error al eliminar el archivo en el servidor:',
              error
            );
            // Aun así actualizamos la factura aunque el archivo no se haya eliminado
            finalizarActualizacion();
          }
        );
    } else {
      finalizarActualizacion();
    }
  }

  onFileSelect(event: any): void {
    const file = event.files[0];
    if (file) {
      this.facturaSeleccionada.archivo = file;
      this.uploadedFileName = file.name; // Guardar el nombre del archivo
    }
    this.cdr.detectChanges();
  }

  removeUploadedFile(): void {
    this.archivoMarcadoParaEliminar = true;
    this.facturaSeleccionada.archivo = null;
    this.uploadedFileName = null;

    const fileUploadComponent = this.fileInput?.nativeElement as any;
    if (fileUploadComponent?.clear) {
      fileUploadComponent.clear();
    }

    this.cdr.detectChanges();
  }

  formatFecha(fecha: Date | string): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }
}
