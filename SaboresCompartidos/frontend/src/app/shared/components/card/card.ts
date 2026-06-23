import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';

export interface RecetaCard {
  id: string;
  titulo: string;
  autor_nombre: string;
  fecha_creacion: string;
  dificultad: string;
  tiempo_aproximado: string;
  porciones: number;
  imagen_url: string | null;
  likes: number;
}

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  private router = inject(Router);

  /** Datos de la receta que se muestran en la tarjeta, recibidos del componente padre */
  @Input() receta!: RecetaCard;

  /** Imagen de respaldo cuando la receta no tiene foto cargada */
  readonly imagenDefault = 'https://www.bettycrocker.lat/mx/wp-content/uploads/sites/2/2020/12/BCmexico-recipe-pastel-maravilla-de-chocolate.png';

  /**
   * Convierte una fecha ISO en un texto relativo legible
   * (Hace un momento, Hace 10 min, Hace 2 horas, Hace 3 días, etc.)
   */
  tiempoRelativo(): string {
    const fecha = new Date(this.receta.fecha_creacion);
    const ahora = new Date();
    const diffMs = ahora.getTime() - fecha.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMin / 60);
    const diffDias = Math.floor(diffHoras / 24);

    if (diffMin < 1) return 'Hace un momento';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHoras < 24) return `Hace ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`;
    if (diffDias < 7) return `Hace ${diffDias} día${diffDias > 1 ? 's' : ''}`;

    return fecha.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  /**
   * Navega a la sección de comentarios de la receta seleccionada.
   * Detiene la propagación del evento para evitar que se active
   * el click del elemento padre (la tarjeta completa).
   */
  irAComentarios(event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/comentarios-page'], { queryParams: { recetaId: this.receta.id } });
  }

  /** Navega al detalle completo de la receta al hacer click en la tarjeta */
  verDetalle(): void {
    this.router.navigate(['/detalle-receta'], { queryParams: { id: this.receta.id } });
  }
}