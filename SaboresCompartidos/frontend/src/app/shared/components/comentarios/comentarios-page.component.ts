import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-comentarios-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comentarios-page.component.html',
  styleUrls: ['./comentarios-page.component.scss']
})
export class ComentariosPageComponent {
  // Inyección del historial dinámico de navegación
  private location = inject(Location);

  /**
   * Te regresa a la vista exacta de donde venías
   */
  volver(): void {
    console.log('Regresando al origen de la receta...');
    this.location.back();
  }
}