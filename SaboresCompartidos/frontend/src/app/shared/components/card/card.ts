import { Component, inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import { MatButtonToggle } from '@angular/material/button-toggle';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule, 
            MatButtonModule, 
            MatIconModule, 
            MatChipsModule,
          ],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  private router = inject(Router);

  /**
   * Navega a la sección de comentarios de la receta seleccionada.
   * Detiene la propagación del evento para evitar que se active
   * el click del elemento padre (la tarjeta completa).
   */
  irAComentarios(event: Event): void {
    event.stopPropagation(); 
    console.log('Abriendo la sección independiente de comentarios...');
    this.router.navigate(['/comentarios-page']);
  }
}