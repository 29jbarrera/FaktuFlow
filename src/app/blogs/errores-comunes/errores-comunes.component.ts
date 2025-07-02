import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavBlogsComponent } from '../nav-blogs/nav-blogs.component';

@Component({
  selector: 'app-errores-comunes',
  standalone: true,
  imports: [FooterComponent, NavBlogsComponent],
  templateUrl: './errores-comunes.component.html',
  styleUrl: './errores-comunes.component.scss',
})
export class ErroresComunesComponent {
  currentYear: number = new Date().getFullYear();
}
