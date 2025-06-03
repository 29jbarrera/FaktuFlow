import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavBlogsComponent } from '../nav-blogs/nav-blogs.component';

@Component({
  selector: 'app-factura-digital',
  imports: [FooterComponent, NavBlogsComponent],
  templateUrl: './factura-digital.component.html',
  styleUrl: './factura-digital.component.scss',
})
export class FacturaDigitalComponent {
  currentYear: number = new Date().getFullYear();
}
