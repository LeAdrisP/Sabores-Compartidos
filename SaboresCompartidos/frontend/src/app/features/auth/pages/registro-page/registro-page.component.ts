import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-registro-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-page.component.html',
  styleUrls: ['./registro-page.component.scss']
})
export class RegistroPageComponent {

  private router = inject(Router);
  private http = inject(HttpClient);

  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';

  correo = signal('');
  contrasena = signal('');
  confirmar_contrasena = signal('');
  isRemembered = signal(false);
  errorMessage = signal('');

  // Alterna recordar sesión
  toggleRemember(): void {
    this.isRemembered.set(!this.isRemembered());
  }

  // Registra usuario
  onRegisterSubmit(): void {

    this.errorMessage.set('');

    if (!this.correo() || !this.contrasena() || !this.confirmar_contrasena()) {
      this.errorMessage.set('Por favor, llena todos los campos.');
      return;
    }

    if (this.contrasena() !== this.confirmar_contrasena()) {
      this.errorMessage.set('Las contraseñas no coinciden.');
      return;
    }

    const body = {
      correo: this.correo(),
      contrasena: this.contrasena(),
      confirmar_contrasena: this.confirmar_contrasena()
    };

    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    this.http.post(`${this.API_URL}api/auth/registro`, body, { headers }).subscribe({

      next: (response: any) => {

        localStorage.setItem('usuario_id', response.usuario_id);

        localStorage.setItem('correo', this.correo());

        this.router.navigate(['/login']);
      },

      error: (err) => {

        this.errorMessage.set(
          err.error?.detail || 'Hubo un problema al conectar con el servidor.'
        );
      }
    });
  }

  // Vuelve al login
  volverAlLogin(): void {
    this.router.navigate(['/login']);
  }
}