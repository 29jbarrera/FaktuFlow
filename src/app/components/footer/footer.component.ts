import { Component } from '@angular/core';
import { NavService } from '../nav/nav.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  starCount: number = 0;

  constructor(private navService: NavService) {}

  ngOnInit(): void {
    this.getStartCount();
  }

  getStartCount(): void {
    this.navService.getStarCount().subscribe((count) => {
      this.starCount = count;
    });
  }
}
