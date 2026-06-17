import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recuperar-page.component.html',
  styleUrls: ['./recuperar-page.component.scss']
})

export class RecuperarPageComponent {
  private router = inject(Router);

  /**
   * Acción del botón de enviar código
   */
  enviarCodigo(): void {
    console.log('Generando código de verificación para el usuario...');
  }

  /**
   * Te regresa a la vista de inicio de sesión
   */
  volverAlLogin(): void {
    this.router.navigate(['/login']);
  }
}