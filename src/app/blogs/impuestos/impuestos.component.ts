import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavBlogsComponent } from '../nav-blogs/nav-blogs.component';

@Component({
  selector: 'app-impuestos',
  imports: [FooterComponent, NavBlogsComponent],
  templateUrl: './impuestos.component.html',
  styleUrl: './impuestos.component.scss',
})
export class ImpuestosComponent {
  currentYear: number = new Date().getFullYear();
}
