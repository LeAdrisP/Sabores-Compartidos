import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-perfil-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editar-perfil-page.component.html',
  styleUrls: ['./editar-perfil-page.component.scss']
})
export class EditarPerfilPageComponent {
  private router = inject(Router);

  // Estado del Switch de mantener sesión
  isSessionActive: boolean = true;

  /**
   * Cambia el estado del switch on/off
   */
  toggleSession(): void {
    this.isSessionActive = !this.isSessionActive;
  }

  /**
   * Guarda los cambios y regresa al perfil
   */
  guardarPerfil(): void {
    console.log('Guardando datos actualizados en el servidor...');
    this.router.navigate(['/perfil']);
  }

  /**
   * Cancela la edición y regresa sin guardar
   */
  cancelar(): void {
    this.router.navigate(['/perfil']);
  }
}