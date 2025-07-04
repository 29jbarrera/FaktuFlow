import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavBlogsComponent } from '../nav-blogs/nav-blogs.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-impuestos',
  standalone: true,
  imports: [FooterComponent, NavBlogsComponent, RouterModule, CommonModule],
  templateUrl: './impuestos.component.html',
  styleUrl: './impuestos.component.scss',
})
export class ImpuestosComponent {
  currentYear: number = new Date().getFullYear();

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
    // {
    //   title: 'Impuestos para autónomos en 2025',
    //   link: '/blog/impuestos',
    //   image: '/assets/blogs/impuestos.webp',
    //   description:
    //     'Todo lo que debes saber para cumplir con Hacienda sin estrés.',
    // },
    {
      title: 'Mejora la productividad de tu negocio',
      link: '/blog/mejora-la-productividad-de-tu-negocio',
      image: '/assets/blogs/productividad.webp',
      description: 'Estrategias efectivas para optimizar tu tiempo y recursos.',
    },
    {
      title: 'Cómo atraer y fidelizar clientes en 2025',
      link: '/blog/cómo-atraer-y-fidelizar-clientes',
      image: '/assets/blogs/fidelizar-clientes-500.webp',
      description: 'Todo lo que debes saber para fidelizar clientes en 2025',
    },
    {
      title: 'Evita los errores comunes de los autónomos',
      link: '/blog/errores-comunes-al-comenzar',
      image: '/assets/blogs/errores-autonomos-500.webp',
      description: 'Descrube como evitar los errores más comunes en 2025.',
    },
    {
      title: 'Herramientas digitales esenciales para autónomos',
      link: '/blog/herramientas-digitales-esenciales',
      image: '/assets/blogs/herramientas-autonomos-500.webp',
      description: 'Todas las herramientas que debes conocer si eres autonómo.',
    },
    {
      title: 'Cómo establecer tarifas justas por tus servicios',
      link: '/blog/tarifas-justas-por-servicios',
      image: '/assets/blogs/tarifas-servicios-500.webp',
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
