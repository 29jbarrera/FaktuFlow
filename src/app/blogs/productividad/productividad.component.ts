import { Component } from '@angular/core';
import { NavBlogsComponent } from '../nav-blogs/nav-blogs.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-productividad',
  standalone: true,
  imports: [NavBlogsComponent, FooterComponent],
  templateUrl: './productividad.component.html',
  styleUrl: './productividad.component.scss',
})
export class ProductividadComponent {
  currentYear: number = new Date().getFullYear();
}
