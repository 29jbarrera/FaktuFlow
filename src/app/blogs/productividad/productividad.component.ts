import { Component } from '@angular/core';

@Component({
  selector: 'app-productividad',
  imports: [],
  templateUrl: './productividad.component.html',
  styleUrl: './productividad.component.scss',
})
export class ProductividadComponent {
  currentYear: number = new Date().getFullYear();
}
