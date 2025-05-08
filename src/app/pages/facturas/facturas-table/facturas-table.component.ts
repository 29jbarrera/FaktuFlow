import {
  Component,
  Input,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FacturasService } from '../facturas.service';
import { formatFechaToYMD } from '../../../shared/utils/date.util';
import {
  CreateFacturaRequest,
  Factura,
  FacturasResponse,
} from '../factura.interface';
import { ImporteEurPipe } from '../../../shared/utils/import-eur.pipe';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { Toast } from 'primeng/toast';
import { ValidationMessage } from '../../../interfaces/validation-message.interface';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  Subscription,
} from 'rxjs';

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
    ReactiveFormsModule,
    MessageModule,
    ImporteEurPipe,
  ],
  templateUrl: './facturas-table.component.html',
  styleUrl: './facturas-table.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class FacturasTableComponent implements AfterViewInit, OnDestroy {
  @Input() clientes: { label: string; value: number }[] = [];

  facturas: Factura[] = [];
  totalFacturas = 0;
  limit = 5;
  sortField = 'fecha_emision';
  sortOrder = -1;
  currentPage = 1;

  facturaSeleccionada: Partial<Factura> = {};
  openDialog = false;
  validationMessages: ValidationMessage[] = [];
  nuevoArchivo: File | null = null;
  archivoMarcadoParaEliminar = false;
  uploadedFileName: string | null = null;

  @ViewChild('fileInput') fileInput: any;

  searchTerm = '';
  @ViewChild('searchInput') searchInputRef!: ElementRef;
  private searchSub!: Subscription;

  constructor(
    private facturasService: FacturasService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) {}

  ngAfterViewInit(): void {
    this.searchSub = fromEvent(this.searchInputRef.nativeElement, 'input')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(600),
        distinctUntilChanged()
      )
      .subscribe((value: string) => {
        this.searchTerm = value.trim();
        this.cargarFacturas();
      });
  }

  ngOnDestroy(): void {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
    }
  }

  cargarFacturas(event: TableLazyLoadEvent = {}): void {
    const {
      first = 0,
      rows = this.limit,
      sortField = this.sortField,
      sortOrder = this.sortOrder,
    } = event;

    const page = Math.floor(first / (rows ?? this.limit)) + 1;
    const finalSortField = Array.isArray(sortField)
      ? sortField[0]
      : sortField || 'fecha_emision';
    const finalSortOrder = sortOrder ?? -1;

    this.facturasService
      .getFacturas(
        page,
        rows ?? this.limit,
        finalSortField,
        finalSortOrder,
        this.searchTerm
      )
      .subscribe((response: FacturasResponse) => {
        this.facturas = response.facturas;
        this.totalFacturas = response.total;
      });
  }

  searchTimeout: any;

  onSearchChange() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.cargarFacturas();
    }, 400);
  }

  deleteFactura(id: number, numeroFactura: string): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar la factura: ${numeroFactura}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      acceptButtonStyleClass: 'p-button danger',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button cancel',
      accept: () => {
        this.facturasService.deleteFactura(id).subscribe((response) => {
          this.facturas = this.facturas.filter((factura) => factura.id !== id);
        });
        this.messageService.add({
          severity: 'success',
          summary: 'Factura Eliminada',
          detail: 'La factura ha sido eliminada exitosamente.',
          life: 4000,
        });

        this.cargarFacturas();
      },
      reject: () => {},
    });
  }

  abrirModalEdicion(factura: Factura): void {
    this.facturaSeleccionada = { ...factura };
    this.facturaSeleccionada.fecha_emision = new Date(factura.fecha_emision);
    this.openDialog = true;
  }

  actualizarFactura(): void {
    this.validationMessages = [];

    if (!this.facturaSeleccionada.id) return;

    const { numero, cliente_id, fecha_emision, importe } =
      this.facturaSeleccionada;
    if (!numero || !cliente_id || !fecha_emision || !importe) {
      this.validationMessages.push({
        severity: 'error',
        summary: 'Error',
        text: 'Por favor completa todos los campos obligatorios. (*)',
      });
      return;
    }

    const facturaActualizada: CreateFacturaRequest = {
      cliente_id: this.facturaSeleccionada.cliente_id!,
      fecha_emision: formatFechaToYMD(
        new Date(this.facturaSeleccionada.fecha_emision!)
      ),
      importe: this.facturaSeleccionada.importe!,
      estado: this.facturaSeleccionada.estado!,
      numero: this.facturaSeleccionada.numero!,
      descripcion: this.facturaSeleccionada.descripcion!,
    };

    if (this.facturaSeleccionada.archivo instanceof File) {
      facturaActualizada.archivo = this.facturaSeleccionada.archivo;
    }

    const finalizarActualizacion = () => {
      this.facturasService
        .updateFactura(this.facturaSeleccionada.id!, facturaActualizada)
        .subscribe(
          () => {
            this.openDialog = false;
            this.archivoMarcadoParaEliminar = false;
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
              detail: `Error al actualizar la factura, ${
                error.message || 'intente nuevamente'
              }`,
              life: 4000,
            });
          }
        );
    };

    if (this.archivoMarcadoParaEliminar) {
      this.facturasService
        .deleteArchivoFactura(this.facturaSeleccionada.id)
        .subscribe(
          () => {
            finalizarActualizacion();
          },
          (error) => {
            finalizarActualizacion();
          }
        );
    } else {
      finalizarActualizacion();
    }
  }

  onFileSelect(event: { files: File[] }): void {
    const file = event.files[0];
    if (file) {
      this.facturaSeleccionada.archivo = file;
      this.uploadedFileName = file.name;
    }
    this.cdr.detectChanges();
  }

  removeUploadedFile(): void {
    this.archivoMarcadoParaEliminar = true;
    this.facturaSeleccionada.archivo = null;
    this.uploadedFileName = null;

    const fileUploadComponent = this.fileInput?.nativeElement;
    if (fileUploadComponent?.clear) {
      fileUploadComponent.clear();
    }

    this.cdr.detectChanges();
  }
}
