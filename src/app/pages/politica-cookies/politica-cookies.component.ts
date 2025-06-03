import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-politica-cookies',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './politica-cookies.component.html',
  styleUrl: './politica-cookies.component.scss',
})
export class PoliticaCookiesComponent {
  getFechaActual(): string {
    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    const ahora = new Date();
    const mes = meses[ahora.getMonth()];
    const año = ahora.getFullYear();

    return `${mes} ${año}`;
  }
}
