import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavBlogsComponent } from '../nav-blogs/nav-blogs.component';

@Component({
  selector: 'app-consejos-financieros',
  imports: [FooterComponent, NavBlogsComponent],
  templateUrl: './consejos-financieros.component.html',
  styleUrl: './consejos-financieros.component.scss',
})
export class ConsejosFinancierosComponent {
  currentYear: number = new Date().getFullYear();
}
