import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-consejos-financieros',
  imports: [FooterComponent],
  templateUrl: './consejos-financieros.component.html',
  styleUrl: './consejos-financieros.component.scss',
})
export class ConsejosFinancierosComponent {
  currentYear: number = new Date().getFullYear();
}
