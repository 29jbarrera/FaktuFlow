import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../pages/auth/auth.service';

@Component({
  selector: 'app-nav',
  imports: [RouterModule, ButtonModule, AccordionModule, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent implements OnInit {
  userEmail: string | null = null;
  isMenuVisible: boolean = true;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.userEmail = sessionStorage.getItem('userEmail');
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
}
