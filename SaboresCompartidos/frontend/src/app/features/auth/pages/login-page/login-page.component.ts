import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent {
  // Manejo del estado del checkbox "Mantener sesión iniciada"
  isRemembered: boolean = false;

  constructor(private router: Router) {}

  /**
   * Cambia el estado del checkbox simulado
   */
  toggleRemember(): void {
    this.isRemembered = !this.isRemembered;
  }

  /**
   * Ejecuta la simulación de inicio de sesión
   * Redirige hacia la pantalla principal de explorar
   */
  onLoginSubmit(): void {
    console.log('Autenticando usuario de Sabores Compartidos...');
    // Redirección usando las rutas oficiales de Angular
    this.router.navigate(['/explorar']);
  }

  /**
   * Cambia la pantalla hacia la página de registro
   */
  navigateToRegistro(): void {
    this.router.navigate(['/registro']);
  }

  navigateToRecuperar(): void {
    this.router.navigate(['/recuperar']);
  }
}