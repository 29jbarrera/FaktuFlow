import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-politica-privacidad',
  imports: [FooterComponent],
  templateUrl: './politica-privacidad.component.html',
  styleUrl: './politica-privacidad.component.scss',
})
export class PoliticaPrivacidadComponent {
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
