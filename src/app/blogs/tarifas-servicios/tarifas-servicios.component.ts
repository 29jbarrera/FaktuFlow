import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavBlogsComponent } from '../nav-blogs/nav-blogs.component';

@Component({
  selector: 'app-tarifas-servicios',
  standalone: true,
  imports: [FooterComponent, NavBlogsComponent],
  templateUrl: './tarifas-servicios.component.html',
  styleUrl: './tarifas-servicios.component.scss',
})
export class TarifasServiciosComponent {
  currentYear: number = new Date().getFullYear();
}
