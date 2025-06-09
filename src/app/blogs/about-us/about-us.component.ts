import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavBlogsComponent } from '../nav-blogs/nav-blogs.component';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, FooterComponent, NavBlogsComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent {
  features = [
    {
      icon: 'fas fa-handshake',
      title: 'Compromiso real',
      description:
        'Escuchamos a nuestros usuarios. Cada mejora y funcionalidad nace de problemas reales que queremos resolver contigo.',
    },
    {
      icon: 'fas fa-eye',
      title: 'Claridad sin rodeos',
      description:
        'Nos alejamos de lo complicado. Tu información debe ser comprensible y tus tareas, rápidas de ejecutar.',
    },
    {
      icon: 'fas fa-sync',
      title: 'Siempre a la última',
      description:
        'Nos mantenemos siempre actualizados para ofrecer nuestra herramienta alineada con las últimas tendencias del sector.',
    },
  ];
}
