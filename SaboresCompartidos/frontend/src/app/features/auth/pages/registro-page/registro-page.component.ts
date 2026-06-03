import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registro-page.component.html',
  styleUrls: ['./registro-page.component.scss']
})

export class RegistroPageComponent {
  private router = inject(Router);

  isRemembered: boolean = false;

  toggleRemember(): void {
    this.isRemembered = !this.isRemembered;
  }

  /**
   * Al registrarse con éxito, redirecciona al feed principal de explorar
   */
  onRegisterSubmit(): void {
    console.log('Cuenta creada con éxito. Redireccionando...');
    this.router.navigate(['/explorar']);
  }

  /**
   * Te regresa a la vista de login
   */
  volverAlLogin(): void {
    this.router.navigate(['/login']);
  }
}