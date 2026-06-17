import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // 👈 Importamos el cliente HTTP

@Component({
  selector: 'app-registro-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-page.component.html',
  styleUrls: ['./registro-page.component.scss']
})
export class RegistroPageComponent {
  private router = inject(Router);
  private http = inject(HttpClient); // 👈 Inyectamos el servicio HTTP

  // ⚠️ COLOCA TU URL DE NGROK AQUÍ (Recuerda cambiarla si reinicias ngrok)
  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';

  correo: string = '';
  contrasena: string = '';
  confirmar_contrasena: string = '';

  isRemembered: boolean = false;
  errorMessage: string = '';

  toggleRemember(): void {
    this.isRemembered = !this.isRemembered;
  }

  onRegisterSubmit(): void {
    this.errorMessage = '';

    if (!this.correo || !this.contrasena || !this.confirmar_contrasena) {
      this.errorMessage = 'Por favor, llena todos los campos.';
      return;
    }

    if (this.contrasena !== this.confirmar_contrasena) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    // Estructuramos el cuerpo del JSON con los nombres exactos que espera Pydantic en Python
    const body = {
      correo: this.correo,
      contrasena: this.contrasena,
      confirmar_contrasena: this.confirmar_contrasena
    };

    console.log('Enviando datos de registro a través del túnel ngrok...');

    const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
    });

    // Realizamos la petición POST real hacia FastAPI
    this.http.post(`${this.API_URL}api/auth/registro`, body, { headers }).subscribe({
      next: (response: any) => {
        console.log('¡Firebase guardó al usuario con éxito!', response);
        // Te redirige al feed principal ya autenticado
        this.router.navigate(['/login']);
      },
    error: (err) => {
        console.error('Error en el registro:', err);
        this.errorMessage = err.error?.detail || 'Hubo un problema al conectar con el servidor.';
      }
    });
  }

  volverAlLogin(): void {
    this.router.navigate(['/login']);
  }
}