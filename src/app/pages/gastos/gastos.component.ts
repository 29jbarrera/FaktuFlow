import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './gastos.component.html',
  styleUrl: './gastos.component.scss',
})
export class GastosComponent {}
