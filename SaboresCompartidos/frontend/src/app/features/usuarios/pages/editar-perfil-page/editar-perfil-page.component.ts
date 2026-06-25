import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-editar-perfil-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-perfil-page.component.html',
  styleUrls: ['./editar-perfil-page.component.scss']
})
export class EditarPerfilPageComponent implements OnInit {

  private router = inject(Router);
  private http = inject(HttpClient);

  private readonly API_URL = 'https://remote-boxcar-morbidity.ngrok-free.dev/';

  private headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });

  nombre = signal('');
  username = signal('');
  bio = signal('');
  ubicacion = signal('');
  correo = signal('');
  iniciales = signal('');

  isSessionActive = signal(true);

  contrasenaActual = signal('');
  nuevaContrasena = signal('');
  contrasenaValidada = signal(false);
  mensajeValidacion = signal('');
  errorValidacion = signal('');

  codigoCorreoEnviado = signal(false);
  codigoCorreo = signal('');
  mensajeCorreoOk = signal('');
  errorCorreo = signal('');

  // Cargar perfil
  ngOnInit(): void {
    const usuarioId = localStorage.getItem('usuario_id');

    if (!usuarioId) {
      this.router.navigate(['/login']);
      return;
    }

    this.http.get(`${this.API_URL}api/usuarios/${usuarioId}`, {
      headers: this.headers
    }).subscribe({
      next: (data: any) => {
        this.nombre.set(data.nombre || '');
        this.username.set(data.nombre_usuario || '');
        this.bio.set(data.biografia || '');
        this.ubicacion.set(data.ubicacion || '');
        this.correo.set(data.correo || '');
        this.iniciales.set(this.obtenerIniciales(this.nombre()));
      },
      error: () => {
        console.error('No se pudo cargar el perfil');
      }
    });
  }

  // Generar iniciales
  private obtenerIniciales(nombre: string): string {
    if (!nombre) return 'US';

    return nombre
      .split(' ')
      .map(p => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // Alternar sesión
  toggleSession(): void {
    this.isSessionActive.set(!this.isSessionActive());
  }

  // Validar contraseña
  confirmarContrasenaActual(): void {
    const usuarioId = localStorage.getItem('usuario_id');

    if (!usuarioId || !this.contrasenaActual()) {
      this.errorValidacion.set('Ingresa tu contraseña actual.');
      return;
    }

    this.errorValidacion.set('');

    this.http.post(
      `${this.API_URL}api/usuarios/${usuarioId}/validar-contrasena`,
      { contrasena: this.contrasenaActual() },
      { headers: this.headers }
    ).subscribe({
      next: () => {
        this.contrasenaValidada.set(true);
        this.mensajeValidacion.set('Verificación correcta');
      },
      error: () => {
        this.contrasenaValidada.set(false);
        this.errorValidacion.set('Contraseña incorrecta.');
      }
    });
  }

  // Actualizar contraseña
  guardarNuevaContrasena(): void {
    const usuarioId = localStorage.getItem('usuario_id');

    if (!usuarioId || !this.contrasenaValidada() || !this.nuevaContrasena())
      return;

    this.http.put(
      `${this.API_URL}api/usuarios/${usuarioId}/cambiar-contrasena`,
      { nueva_contrasena: this.nuevaContrasena() },
      { headers: this.headers }
    ).subscribe({
      next: () => {
        this.mensajeValidacion.set('Contraseña actualizada con éxito');
        this.nuevaContrasena.set('');
        this.contrasenaActual.set('');
        this.contrasenaValidada.set(false);
      },
      error: () => {
        this.errorValidacion.set('No se pudo actualizar la contraseña.');
      }
    });
  }

  // Guardar perfil
  guardarPerfil(): void {
    const usuarioId = localStorage.getItem('usuario_id');

    if (!usuarioId) return;

    const body = {
      nombre: this.nombre(),
      nombre_usuario: this.username(),
      biografia: this.bio(),
      ubicacion: this.ubicacion()
    };

    this.http.put(
      `${this.API_URL}api/usuarios/${usuarioId}`,
      body,
      { headers: this.headers }
    ).subscribe({
      next: () => {
        this.router.navigate(['/perfil']);
      },
      error: (err) => {
        console.error('Error al guardar:', err);
      }
    });
  }

  // Cancelar edición
  cancelar(): void {
    this.router.navigate(['/perfil']);
  }

  // Enviar código
  enviarCodigoCorreo(): void {
    const usuarioId = localStorage.getItem('usuario_id');

    if (!usuarioId) return;

    this.errorCorreo.set('');

    this.http.post(
      `${this.API_URL}api/usuarios/${usuarioId}/enviar-codigo-correo`,
      {},
      { headers: this.headers }
    ).subscribe({
      next: () => {
        this.codigoCorreoEnviado.set(true);
        this.mensajeCorreoOk.set('Código enviado a tu correo');
      },
      error: () => {
        this.errorCorreo.set('No se pudo enviar el código.');
      }
    });
  }

  // Verificar código
  confirmarCodigoCorreo(): void {
    const usuarioId = localStorage.getItem('usuario_id');

    if (!usuarioId || !this.codigoCorreo()) return;

    this.errorCorreo.set('');

    this.http.post(
      `${this.API_URL}api/usuarios/${usuarioId}/validar-codigo-correo`,
      { codigo: this.codigoCorreo() },
      { headers: this.headers }
    ).subscribe({
      next: () => {
        this.mensajeCorreoOk.set('Correo verificado correctamente');
        this.codigoCorreoEnviado.set(false);
        this.codigoCorreo.set('');
      },
      error: () => {
        this.errorCorreo.set('Código inválido o expirado.');
      }
    });
  }
}