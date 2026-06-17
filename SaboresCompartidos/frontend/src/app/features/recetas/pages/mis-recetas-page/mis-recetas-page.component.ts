import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-recetas-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-recetas-page.component.html',
  styleUrls: ['./mis-recetas-page.component.scss']
})
export class MisRecetasPageComponent {
  // Aquí añadirás las colecciones de arreglos e interfaces dinámicas más adelante
  // Inyección del enrutador
  private router = inject(Router);

  /**
   * 👇 MÉTODO AGREGADO: Abre la pantalla detallada de la tlayuda oaxaqueña
   */
  verDetalleReceta(): void {
    console.log('Navegando a la vista extendida de la preparación...');
    this.router.navigate(['/detalle-receta']);
  }
}