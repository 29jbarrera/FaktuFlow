import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../pages/auth/auth.service';
import { FooterComponent } from '../footer/footer.component';
import { AvatarModule } from 'primeng/avatar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    RouterModule,
    ButtonModule,
    AccordionModule,
    CommonModule,
    FooterComponent,
    AvatarModule,
    ConfirmDialogModule,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
  providers: [ConfirmationService],
})
export class NavComponent implements OnInit {
  userName: string | null = null;
  userApellidos: string | null = null;
  isMenuVisible: boolean = true;
  userInitial: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('nombre');
    this.userApellidos = sessionStorage.getItem('apellidos');
    this.getUserInitial();
  }

  logoutConfirm(): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas cerrar la sesión?`,
      header: 'Cerrar sesión',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Sí',
      acceptButtonStyleClass: 'p-button danger',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button cancel',
      accept: () => {
        this.logout();
      },
      reject: () => {},
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    window.location.reload();
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
    this.closeMenu();
  }

  getUserInitial(): void {
    this.userInitial = this.userName
      ? this.userName.charAt(0).toUpperCase()
      : '';
  }
}
