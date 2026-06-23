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
  private headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

  nombre = signal('');
  username = signal('');
  bio = signal('');
  ubicacion = signal('');
  correo = signal('');
  iniciales = signal('');
  isSessionActive = signal(true);

  // Estado para el cambio de contraseña
  contrasenaActual = signal('');
  nuevaContrasena = signal('');
  contrasenaValidada = signal(false);
  mensajeValidacion = signal('');
  errorValidacion = signal('');

  // Estado para la verificación de correo
  codigoCorreoEnviado = signal(false);
  codigoCorreo = signal('');
  mensajeCorreoOk = signal('');
  errorCorreo = signal('');

  /**
   * Carga los datos actuales del perfil desde el backend al entrar a la pantalla.
   * Si no hay sesión activa, redirige al login.
   */
  ngOnInit(): void {
    const usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) {
      this.router.navigate(['/login']);
      return;
    }

    this.http.get(`${this.API_URL}api/usuarios/${usuarioId}`, { headers: this.headers }).subscribe({
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

  /**
   * Genera las iniciales del avatar a partir del nombre completo del usuario.
   * Devuelve 'US' como valor por defecto si el nombre está vacío.
   */
  private obtenerIniciales(nombre: string): string {
    if (!nombre) return 'US';
    return nombre.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  }

  /** Alterna el estado del switch "Mantener sesión iniciada" */
  toggleSession(): void {
    this.isSessionActive.set(!this.isSessionActive());
  }

  /**
   * Valida la contraseña actual contra el backend. Si es correcta,
   * desbloquea el campo de nueva contraseña y muestra confirmación.
   */
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

  /**
   * Envía la nueva contraseña al backend solo si la contraseña
   * actual ya fue validada previamente.
   */
  guardarNuevaContrasena(): void {
    const usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId || !this.contrasenaValidada() || !this.nuevaContrasena()) return;

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

  /**
   * Envía los datos editados al backend para actualizar el perfil en Firestore.
   * Al completarse con éxito, redirige a la pantalla de perfil.
   */
  guardarPerfil(): void {
    const usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) return;

    const body = {
      nombre: this.nombre(),
      nombre_usuario: this.username(),
      biografia: this.bio(),
      ubicacion: this.ubicacion()
    };

    this.http.put(`${this.API_URL}api/usuarios/${usuarioId}`, body, { headers: this.headers }).subscribe({
      next: () => {
        this.router.navigate(['/perfil']);
      },
      error: (err) => {
        console.error('Error al guardar:', err);
      }
    });
  }

  /** Cancela la edición y regresa al perfil sin guardar cambios */
  cancelar(): void {
    this.router.navigate(['/perfil']);
  }

  /**
   * Solicita al backend que genere y envíe un código de verificación
   * al correo del usuario. Al completarse, desbloquea el campo de código.
   */
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

  /**
   * Envía el código ingresado al backend para validar y marcar
   * el correo del usuario como verificado.
   */
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