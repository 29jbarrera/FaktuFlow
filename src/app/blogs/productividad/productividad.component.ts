import { Component } from '@angular/core';
import { NavBlogsComponent } from '../nav-blogs/nav-blogs.component';

@Component({
  selector: 'app-productividad',
  standalone: true,
  imports: [NavBlogsComponent],
  templateUrl: './productividad.component.html',
  styleUrl: './productividad.component.scss',
})
export class ProductividadComponent {
  currentYear: number = new Date().getFullYear();
}
