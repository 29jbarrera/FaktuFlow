import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { TieredMenuModule } from 'primeng/tieredmenu';

@Component({
  selector: 'app-nav-blogs',
  standalone: true,
  imports: [CommonModule, TieredMenuModule, RouterModule],
  templateUrl: './nav-blogs.component.html',
  styleUrl: './nav-blogs.component.scss',
})
export class NavBlogsComponent {
  isMenuOpen = false;
  showBlogDropdown = false;
  blogItems: MenuItem[] = [];

  constructor(public router: Router) {}

  ngOnInit() {
    this.blogItems = [
      {
        label: '-> Como gestionar facturas electrónicas',
        routerLink: '/blog/factura-digital',
      },
      { separator: true },
      {
        label: '-> Lleva tus finanzas al siguiente nivel',
        routerLink: '/blog/consejos-financieros',
      },
      { separator: true },
      {
        label: '-> Impuestos: Lo básicos que debes saber',
        routerLink: '/blog/impuestos',
      },
      { separator: true },
      {
        label: '-> Mejora la productividad en tu negocio',
        routerLink: '/blog/mejora-la-productividad-de-tu-negocio',
      },
    ];
  }

  isActive(path: string): boolean {
    const currentUrl = this.router.url;

    if (path === '/') {
      return currentUrl === '/';
    }

    if (path === '/blog') {
      return currentUrl.startsWith('/blog');
    }

    if (path === '/sobre-nosotros') {
      return currentUrl.startsWith('/sobre-nosotros');
    }

    return currentUrl.startsWith(path);
  }
}
