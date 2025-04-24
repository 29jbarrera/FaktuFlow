import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../pages/auth/auth.service';
import { NavService } from './nav.service';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    RouterModule,
    ButtonModule,
    AccordionModule,
    CommonModule,
    FooterComponent,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent implements OnInit {
  userName: string | null = null;
  userApellidos: string | null = null;
  isMenuVisible: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private navService: NavService
  ) {}

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('nombre');
    this.userApellidos = sessionStorage.getItem('apellidos');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  closeMenu(): void {
    if (window.innerWidth < 640) {
      this.isMenuVisible = false;
    }
  }

  navigateMiPerfil(): void {
    this.router.navigate(['/dashboard/info']);
  }
}
