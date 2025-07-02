import { Component } from '@angular/core';
import { NavBlogsComponent } from '../nav-blogs/nav-blogs.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-fidelizar-clientes',
  imports: [NavBlogsComponent, FooterComponent],
  templateUrl: './fidelizar-clientes.component.html',
  styleUrl: './fidelizar-clientes.component.scss',
})
export class FidelizarClientesComponent {
  currentYear: number = new Date().getFullYear();
}
