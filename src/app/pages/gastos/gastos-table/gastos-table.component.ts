import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  Subscription,
} from 'rxjs';
import { GastosService } from '../gastos.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { CreateGastoRequest, Gasto } from '../gastos.interface';
import { ValidationMessage } from '../../../interfaces/validation-message.interface';
import { DatePickerModule } from 'primeng/datepicker';
import { formatFechaToYMD } from '../../../shared/utils/date.util';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-gastos-table',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    ToastModule,
    ConfirmDialogModule,
    ButtonModule,
    DialogModule,
    InputGroupAddonModule,
    InputGroupModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    MessageModule,
    DatePickerModule,
    SelectModule,
  ],
  templateUrl: './gastos-table.component.html',
  styleUrl: './gastos-table.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class GastosTableComponent implements AfterViewInit, OnDestroy {
  @Input() categoriaOptions: { label: string; value: string }[] = [];
  gastos: Gasto[] = [];
  totalGastos = 0;

  readonly limit = 5;
  readonly sortField = 'fecha';
  readonly sortOrder = 1;

  currentPage = 1;
  gastoSeleccionado: Partial<Gasto> = {};
  openDialog = false;
  validationMessages: ValidationMessage[] = [];

  searchTerm = '';
  @ViewChild('searchInput') searchInputRef!: ElementRef;
  private searchSub!: Subscription;

  constructor(
    private gastosService: GastosService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngAfterViewInit(): void {
    this.searchSub = fromEvent(this.searchInputRef.nativeElement, 'input')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((value: string) => {
        this.searchTerm = value.trim();
        this.cargarGastos();
      });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  cargarGastos(event: TableLazyLoadEvent = {}): void {
    const {
      first = 0,
      rows = this.limit,
      sortField = this.sortField,
      sortOrder = this.sortOrder,
    } = event;

    const page = Math.floor(first / (rows ?? this.limit)) + 1;
    const finalSortField = Array.isArray(sortField)
      ? sortField[0]
      : sortField || 'fecha';
    const finalSortOrder = sortOrder ?? -1;

    this.gastosService
      .getGastos(
        page,
        rows ?? this.limit,
        finalSortField,
        finalSortOrder,
        this.searchTerm
      )
      .subscribe((response) => {
        this.gastos = response.gastos;
        this.totalGastos = response.total;
      });
  }

  deleteGasto(id: number): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar este gasto?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => this.ejecutarEliminacionGasto(id),
    });
  }

  private ejecutarEliminacionGasto(id: number): void {
    this.gastosService.deleteGasto(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Gasto Eliminado',
          detail: 'El gasto ha sido eliminado exitosamente',
          life: 4000,
        });
        this.cargarGastos();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el gasto',
          life: 4000,
        });
      },
    });
  }

  openModal(gasto: Gasto): void {
    this.gastoSeleccionado = { ...gasto };
    this.gastoSeleccionado.fecha = new Date(gasto.fecha);
    this.openDialog = true;
  }

  updateGasto(): void {
    this.validationMessages = [];

    if (!this.gastoSeleccionado.id) return;

    const { nombre_gasto, categoria, fecha, importe_total } =
      this.gastoSeleccionado;

    if (
      !nombre_gasto ||
      nombre_gasto.trim() === '' ||
      !categoria ||
      categoria.trim?.() === '' ||
      !fecha ||
      fecha.toString().trim() === '' ||
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

    const gastoSeleccionado: CreateGastoRequest = {
      nombre_gasto: nombre_gasto.trim(),
      categoria: categoria.trim(),
      fecha: formatFechaToYMD(new Date(this.gastoSeleccionado.fecha!)),
      importe_total: Number(importe_total),
      usuario_id: this.gastoSeleccionado.usuario_id!,
    };

    console.log(gastoSeleccionado);

    if (this.validationMessages.length > 0) {
      return;
    }

    this.gastosService
      .updateGasto(this.gastoSeleccionado.id, gastoSeleccionado)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Gasto Actualizado',
            detail: 'El gasto ha sido actualizado exitosamente',
            life: 4000,
          });
          this.cargarGastos();
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
