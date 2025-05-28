import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-terminos-de-uso',
  imports: [FooterComponent],
  templateUrl: './terminos-de-uso.component.html',
  styleUrl: './terminos-de-uso.component.scss',
})
export class TerminosDeUsoComponent {
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
