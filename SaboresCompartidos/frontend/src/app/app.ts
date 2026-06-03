import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importación necesaria para el *ngIf
import { Router, RouterOutlet } from '@angular/router';
import { NavbarInferiorComponent } from './layout/navbar-inferior/navbar-inferior.component';

@Component({
  selector: 'app-root',
  standalone: true, // Aseguramos el estado standalone explícito
  imports: [CommonModule, RouterOutlet, NavbarInferiorComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'] // Corregido a styleUrls como pide la guía
})
export class App {
  title = 'Sabores Compartidos';
  
  // Inyección moderna del servicio Router de Angular
  private router = inject(Router);

  /**
   * Devuelve 'true' si el usuario NO está en la pantalla de login, registro o recuperación.
   * Se mapea directo en el *ngIf de tu archivo app.html.
   */
  mostrarNavegacion(): boolean {
    const rutaActual = this.router.url;
    
    // 👇 MODIFICADO: Agregamos la validación para que oculte la barra en recuperar-password
    return !(
      rutaActual.includes('login') || 
      rutaActual.includes('registro') || 
      rutaActual.includes('recuperar') ||
      rutaActual.includes('editar-perfil')
    );
  }
}