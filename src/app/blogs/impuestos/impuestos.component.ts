import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-impuestos',
  imports: [FooterComponent],
  templateUrl: './impuestos.component.html',
  styleUrl: './impuestos.component.scss',
})
export class ImpuestosComponent {
  currentYear: number = new Date().getFullYear();
}
