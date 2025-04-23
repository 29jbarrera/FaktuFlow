import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CreateIngresoRequest, Ingreso } from '../ingreso.interface';
import { ValidationMessage } from '../../../interfaces/validation-message.interface';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  Subscription,
} from 'rxjs';
import { IngresoService } from '../ingreso.service';
import { ImporteEurPipe } from '../../../shared/utils/import-eur.pipe';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { formatFechaToYMD } from '../../../shared/utils/date.util';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-ingresos-table',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    ButtonModule,
    InputGroupAddonModule,
    InputGroupModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    MessageModule,
    DatePickerModule,
    SelectModule,
    TextareaModule,
    ImporteEurPipe,
  ],
  templateUrl: './ingresos-table.component.html',
  styleUrl: './ingresos-table.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class IngresosTableComponent {
  @Input() categoriaOptions: { label: string; value: string }[] = [];
  ingresos: Ingreso[] = [];
  totalIngresos = 0;

  readonly limit = 5;
  readonly sortField = 'fecha_ingreso';
  readonly sortOrder = -1;

  currentPage = 1;
  ingresoSeleccionado: Partial<Ingreso> = {};
  openDialog = false;
  validationMessages: ValidationMessage[] = [];

  searchTerm = '';
  @ViewChild('searchInput') searchInputRef!: ElementRef;
  private searchSub!: Subscription;

  constructor(
    private ingresoService: IngresoService,
    private confirmationService: ConfirmationService,
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
        this.cargarIngresos();
      });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  cargarIngresos(event: TableLazyLoadEvent = {}): void {
    const {
      first = 0,
      rows = this.limit,
      sortField = this.sortField,
      sortOrder = this.sortOrder,
    } = event;

    const page = Math.floor(first / (rows ?? this.limit)) + 1;
    const finalSortField = Array.isArray(sortField)
      ? sortField[0]
      : sortField || 'fecha_ingreso';
    const finalSortOrder = sortOrder ?? -1;

    this.ingresoService
      .getIngresos(
        page,
        rows ?? this.limit,
        finalSortField,
        finalSortOrder,
        this.searchTerm
      )
      .subscribe((response) => {
        this.ingresos = response.ingresos;
        this.totalIngresos = response.total;
      });
  }

  deleteIngreso(id: number): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar este ingreso?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => this.ejecutarEliminacionIngreso(id),
    });
  }

  private ejecutarEliminacionIngreso(id: number): void {
    this.ingresoService.deleteIngreso(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Ingreso Eliminado',
          detail: 'El ingreso ha sido eliminado exitosamente',
          life: 4000,
        });
        this.cargarIngresos();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el ingreso',
          life: 4000,
        });
      },
    });
  }

  openModal(ingreso: Ingreso): void {
    this.ingresoSeleccionado = { ...ingreso };
    this.ingresoSeleccionado.fecha_ingreso = new Date(ingreso.fecha_ingreso);
    this.openDialog = true;
  }

  updateIngreso(): void {
    this.validationMessages = [];

    if (!this.ingresoSeleccionado.id) return;

    const { nombre_ingreso, categoria, fecha_ingreso, importe_total } =
      this.ingresoSeleccionado;

    if (
      !nombre_ingreso ||
      nombre_ingreso.trim() === '' ||
      !categoria ||
      categoria.trim?.() === '' ||
      !fecha_ingreso ||
      fecha_ingreso.toString().trim() === '' ||
      importe_total === null ||
      importe_total === undefined ||
      importe_total.toString().trim() === ''
    ) {
      this.validationMessages.push({
        severity: 'error',
        summary: 'Campos incompletos',
        text: 'Por favor completa todos los campos obligatorios. (*)',
      });
      return;
    }

    const ingresoSeleccionado: CreateIngresoRequest = {
      nombre_ingreso: nombre_ingreso.trim(),
      categoria: categoria.trim(),
      fecha_ingreso: formatFechaToYMD(
        new Date(this.ingresoSeleccionado.fecha_ingreso!)
      ),
      importe_total: Number(importe_total),
      usuario_id: this.ingresoSeleccionado.usuario_id!,
      descripcion: this.ingresoSeleccionado.descripcion,
    };

    if (this.validationMessages.length > 0) {
      return;
    }

    this.ingresoService
      .updateIngreso(this.ingresoSeleccionado.id, ingresoSeleccionado)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Ingreso Actualizado',
            detail: 'El ingreso ha sido actualizado exitosamente',
            life: 4000,
          });
          this.cargarIngresos();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el gasto',
            life: 4000,
          });
        },
      });
    this.openDialog = false;
  }
}
