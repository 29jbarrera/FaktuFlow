import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavBlogsComponent } from '../nav-blogs/nav-blogs.component';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, FooterComponent, NavBlogsComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent {}
