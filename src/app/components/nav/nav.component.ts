import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../pages/auth/auth.service';
import { NavService } from './nav.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule, ButtonModule, AccordionModule, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent implements OnInit {
  userName: string | null = null;
  userApellidos: string | null = null;
  isMenuVisible: boolean = true;
  starCount: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private navService: NavService
  ) {}

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('nombre');
    this.userApellidos = sessionStorage.getItem('apellidos');
    this.getStartCount();
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

  getStartCount(): void {
    this.navService.getStarCount().subscribe((count) => {
      this.starCount = count;
    });
  }
}
