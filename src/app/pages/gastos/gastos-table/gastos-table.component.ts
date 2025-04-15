import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  Subscription,
} from 'rxjs';
import { GastosService } from '../gastos.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-gastos-table',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './gastos-table.component.html',
  styleUrl: './gastos-table.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class GastosTableComponent implements AfterViewInit, OnDestroy {
  gastos: any[] = [];
  totalGastos = 0;

  readonly limit = 5;
  readonly sortField = 'fecha';
  readonly sortOrder = 1;

  currentPage = 1;

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
}
