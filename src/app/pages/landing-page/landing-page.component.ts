import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
    RouterModule,
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
      icon: 'fas fa-file',
      title: 'Facturación rápida',
      description: 'Crea, gestiona y consulta facturas desde cualquier lugar.',
    },
    {
      icon: 'fas fa-users',
      title: 'Gestión de clientes',
      description: 'Organiza tu base de clientes de forma intuitiva.',
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Resumen financiero',
      description: 'Gráficos y reportes claros mensuales y anuales.',
    },
    {
      icon: 'fas fa-cloud',
      title: 'Acceso en la nube',
      description: 'Trabaja desde cualquier dispositivo sin instalaciones.',
    },
    {
      icon: 'fas fa-star',
      title: 'Gratuito',
      description: 'Totalmente gratuito. Ideal para pequeños negocios.',
    },
    {
      icon: 'fas fa-desktop',
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

  currentPage = 0;
  blogsPerPage = 4;

  blogs = [
    {
      title: 'Cómo gestionar facturas electrónicas en 2025',
      link: '/blog/factura-digital',
      image: '/assets/blogs/facturas-electronicas.webp',
      description:
        'Simplifica la gestión de tus facturas con consejos actualizados.',
    },
    {
      title: 'Consejos financieros para autónomos',
      link: '/blog/consejos-financieros',
      image: '/assets/blogs/consejos-financieros.webp',
      description:
        'Mejora el manejo de tus finanzas con tips prácticos para tu negocio.',
    },
    {
      title: 'Impuestos para autónomos en 2025',
      link: '/blog/impuestos',
      image: '/assets/blogs/impuestos.webp',
      description:
        'Todo lo que debes saber para cumplir con Hacienda sin estrés.',
    },
    {
      title: 'Mejora la productividad de tu negocio',
      link: '/blog/mejora-la-productividad-de-tu-negocio',
      image: '/assets/blogs/productividad.webp',
      description: 'Estrategias efectivas para optimizar tu tiempo y recursos.',
    },
    {
      title: 'Cómo atraer y fidelizar clientes en 2025',
      link: 'blog/cómo-atraer-y-fidelizar-clientes',
      image: '/assets/blogs/declaracion.webp',
      description: 'Todo lo que debes saber para fidelizar clientes en 2025',
    },
    {
      title: 'Evita los errores comunes de los autónomos',
      link: 'blog/errores-comunes-al-comenzar',
      image: '/assets/blogs/errores-facturacion.webp',
      description: 'Descrube como evitar los errores más comunes en 2025.',
    },
    {
      title: 'Herramientas digitales esenciales para autónomos',
      link: 'blog/herramientas-digitales-esenciales',
      image: '/assets/blogs/herramientas.webp',
      description: 'Todas las herramientas que debes conocer si eres autonómo.',
    },
    {
      title: ' Cómo establecer tarifas justas por tus servicios',
      link: 'blog/tarifas-justas-por-servicios',
      image: '/assets/blogs/herramientas.webp',
      description:
        'En este artículo te guiaremos paso a paso para fijar precios justos.',
    },
  ];

  get visibleBlogs() {
    const total = this.blogs.length;
    const start = this.currentPage * this.blogsPerPage;

    // Última página
    const isLastPage = start + this.blogsPerPage >= total;

    if (isLastPage && total % this.blogsPerPage !== 0) {
      const startIndex = Math.max(0, total - this.blogsPerPage);
      return this.blogs.slice(startIndex);
    }

    // Páginas normales
    return this.blogs.slice(start, start + this.blogsPerPage);
  }

  nextPage() {
    if ((this.currentPage + 1) * this.blogsPerPage < this.blogs.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }
}
