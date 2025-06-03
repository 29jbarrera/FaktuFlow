import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavBlogsComponent } from '../../blogs/nav-blogs/nav-blogs.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    FooterComponent,
    AccordionModule,
    NavBlogsComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  currentYear: number = new Date().getFullYear();

  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  author = {
    name: 'Javier Barrera',
    github: '29jbarrera',
  };

  features = [
    {
      icon: 'pi pi-file',
      title: 'Facturación rápida',
      description: 'Crea, gestiona y consulta facturas desde cualquier lugar.',
    },
    {
      icon: 'pi pi-users',
      title: 'Gestión de clientes',
      description: 'Organiza tu base de clientes de forma intuitiva.',
    },
    {
      icon: 'pi pi-chart-line',
      title: 'Resumen financiero',
      description: 'Gráficos y reportes claros mensuales y anuales.',
    },
    {
      icon: 'pi pi-cloud',
      title: 'Acceso en la nube',
      description: 'Trabaja desde cualquier dispositivo sin instalaciones.',
    },
    {
      icon: 'pi pi-star',
      title: 'Gratuito',
      description: 'Totalmente gratuito. Ideal para pequeños negocios.',
    },
    {
      icon: 'pi pi-desktop',
      title: '100% Responsive',
      description: 'Diseño adaptable a móviles, tablets y escritorios.',
    },
  ];

  faq = [
    {
      question: '¿FaktuFlow es realmente gratuito?',
      answer:
        'Sí. FaktuFlow es 100% gratuito, sin cargos ocultos. Perfecto para autónomos y pequeños negocios.',
    },
    {
      question: '¿Necesito instalar algo?',
      answer:
        'No. FaktuFlow funciona completamente en la nube. Solo necesitas una conexión a internet y tu navegador.',
    },
    {
      question: '¿Puedo acceder desde el móvil?',
      answer:
        'Sí. Nuestra plataforma es completamente responsive y se adapta a móviles, tablets y computadoras.',
    },
    {
      question: '¿Mis datos están seguros?',
      answer:
        'Claro. Usamos cifrado y buenas prácticas para proteger tu información financiera y personal.',
    },
  ];
}
