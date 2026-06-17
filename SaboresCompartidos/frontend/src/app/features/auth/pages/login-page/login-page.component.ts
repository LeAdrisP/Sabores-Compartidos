import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  private router = inject(Router);
  private http = inject(HttpClient);

  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';

  correo: string = '';
  contrasena: string = '';
  isRemembered: boolean = false;
  errorMessage: string = '';

  /** Alterna el estado del checkbox "Mantener sesión iniciada" */
  toggleRemember(): void {
    this.isRemembered = !this.isRemembered;
  }

  /**
   * Valida los campos y envía las credenciales al backend.
   * Si el login es exitoso, guarda el ID del usuario en localStorage
   * y redirige a la pantalla de explorar.
   */
  onLoginSubmit(): void {
    this.errorMessage = '';

    if (!this.correo || !this.contrasena) {
      this.errorMessage = 'Por favor, llena todos los campos.';
      return;
    }

    const body = { correo: this.correo, contrasena: this.contrasena };
    const headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

    this.http.post(`${this.API_URL}api/auth/login`, body, { headers }).subscribe({
      next: (response: any) => {
        console.log('Login exitoso', response);
        localStorage.setItem('usuario_id', response.usuario_id); 
        localStorage.setItem('correo', this.correo);             
        this.router.navigate(['/explorar']);
      },
      error: (err) => {
        this.errorMessage = 'Correo o contraseña incorrecta.';
      }
    });
  }

  /** Redirige a la pantalla de registro de nuevo usuario */
  navigateToRegistro(): void {
    this.router.navigate(['/registro']);
  }

  /** Redirige a la pantalla de recuperación de contraseña */
  navigateToRecuperar(): void {
    this.router.navigate(['/recuperar']);
  }
}