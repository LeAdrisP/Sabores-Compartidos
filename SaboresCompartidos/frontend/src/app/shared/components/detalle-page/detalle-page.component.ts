import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-detalle-page',
  standalone: true,
  imports: [
    CommonModule, 
    MatChipsModule, 
    MatIconModule
  ],
  templateUrl: './detalle-page.component.html',
  styleUrls: ['./detalle-page.component.scss']
})
export class DetallePageComponent {
  private location = inject(Location);

  /**
   * Cierra la vista de detalles y regresa a la pantalla anterior (Explorar)
   */
  volver(): void {
    console.log('Regresando a la pantalla anterior en el historial...');
    this.location.back(); // 👈 ¡MÁGIA! Regresa a /explorar o a /mis_recetas automáticamente
  }
}