import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-aviso-legal',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './aviso-legal.component.html',
  styleUrl: './aviso-legal.component.scss',
})
export class AvisoLegalComponent {
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
