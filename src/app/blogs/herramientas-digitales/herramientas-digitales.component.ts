import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavBlogsComponent } from '../nav-blogs/nav-blogs.component';

@Component({
  selector: 'app-herramientas-digitales',
  standalone: true,
  imports: [FooterComponent, NavBlogsComponent],
  templateUrl: './herramientas-digitales.component.html',
  styleUrl: './herramientas-digitales.component.scss',
})
export class HerramientasDigitalesComponent {
  currentYear: number = new Date().getFullYear();
}
