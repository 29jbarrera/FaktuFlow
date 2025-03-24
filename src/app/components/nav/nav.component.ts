import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule, ButtonModule, AccordionModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent implements OnInit {
  userEmail: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.userEmail = sessionStorage.getItem('userEmail');
  }

  logout(): void {
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('authToken');

    this.router.navigate(['/']);
  }
}
