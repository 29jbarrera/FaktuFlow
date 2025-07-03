import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavBlogsComponent } from '../nav-blogs/nav-blogs.component';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, FooterComponent, NavBlogsComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent {
  finalUsers = 50;
  finalInvoices = 10000;
  finalUptime = 99.9;
  finalResponseTime = 5;

  animatedUsers = 0;
  animatedInvoices = 0;
  animatedUptime = 0;
  animatedResponseTime = 0;

  constructor() {
    this.animateCount('users', this.finalUsers, 1500);
    this.animateCount('invoices', this.finalInvoices, 2000);
    this.animateDecimal('uptime', this.finalUptime, 1500);
    this.animateCount('responseTime', this.finalResponseTime, 1500);
  }

  animateCount(
    type: 'users' | 'invoices' | 'responseTime',
    end: number,
    duration: number
  ) {
    const steps = 50;
    const stepTime = duration / steps;
    let currentStep = 0;
    const source$ = interval(stepTime).pipe(take(steps + 1));
    source$.subscribe(() => {
      currentStep++;
      const val = Math.min(Math.floor((end / steps) * currentStep), end);
      switch (type) {
        case 'users':
          this.animatedUsers = val;
          break;
        case 'invoices':
          this.animatedInvoices = val;
          break;
        case 'responseTime':
          this.animatedResponseTime = val;
          break;
      }
    });
  }

  animateDecimal(type: 'uptime', end: number, duration: number) {
    const steps = 50;
    const stepTime = duration / steps;
    let currentStep = 0;
    const source$ = interval(stepTime).pipe(take(steps + 1));
    source$.subscribe(() => {
      currentStep++;
      const val = Math.min((end / steps) * currentStep, end);
      this.animatedUptime = parseFloat(val.toFixed(1));
    });
  }

  features = [
    {
      icon: 'fas fa-handshake',
      title: 'Compromiso real',
      description:
        'Escuchamos activamente a nuestros usuarios para evolucionar el producto en función de sus necesidades.',
    },
    {
      icon: 'fas fa-eye',
      title: 'Claridad sin rodeos',
      description:
        'Creamos interfaces intuitivas que permiten gestionar sin esfuerzo ni tecnicismos.',
    },
    {
      icon: 'fas fa-sync',
      title: 'Actualización constante',
      description:
        'Siempre al día con normativas, tecnología y necesidades emergentes del sector.',
    },
  ];
}
