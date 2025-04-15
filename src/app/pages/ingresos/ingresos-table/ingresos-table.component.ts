import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Ingreso } from '../ingreso.interface';
import { ValidationMessage } from '../../../interfaces/validation-message.interface';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  Subscription,
} from 'rxjs';
import { IngresoService } from '../ingreso.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-ingresos-table',
  standalone: true,
  imports: [TableModule, CommonModule],
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
  readonly sortOrder = 1;

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
        debounceTime(500),
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
}
